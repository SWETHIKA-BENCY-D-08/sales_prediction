from flask import Flask, Response, request
import pandas as pd
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.metrics import mean_squared_error, mean_absolute_error
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def upload():
    file = request.files['csvFile']
    if file.filename == '':
        return 'No file selected'

    periodicity = request.form['periodicity']
    periods = int(request.form['periods'])
    
    df = pd.read_csv(file)
    
    df.dropna()
    
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')
    df['day_of_week'] = df['Date'].dt.dayofweek
    df['day_of_month'] = df['Date'].dt.day
    df['month'] = df['Date'].dt.month
    df['year'] = df['Date'].dt.year

    X = df[['day_of_week', 'day_of_month', 'month', 'year']]
    y = df['GOLD']
    
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        reg = LinearRegression()
        reg.fit(X_train, y_train)
        y_pred = reg.predict(X_test)
        
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
        mad = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        print(mse,rmse,mape,mad)
            
    except Exception as e:
        return f"Error: {str(e)}"
    
    last_date = df['Date'].max()
    future_dates = pd.date_range(last_date, periods=periods+1, freq=periodicity)[1:]
    future_df = pd.DataFrame({'Date': future_dates})
    future_df['day_of_week'] = future_df['Date'].dt.dayofweek
    future_df['day_of_month'] = future_df['Date'].dt.day
    future_df['month'] = future_df['Date'].dt.month
    future_df['year'] = future_df['Date'].dt.year
    
    future_X = future_df[['day_of_week', 'day_of_month', 'month', 'year']]
    future_y = reg.predict(future_X)
    future_df['GOLD'] = future_y

    future_df['Date'] = future_df['Date'].apply(lambda x: x.strftime('%d-%m-%Y'))

    output_df = future_df[['Date', 'GOLD']]
    output = output_df.to_dict(orient='records')

    output = output_df.to_csv(header=True)
    
    # with open(r"C:\Users\91999\Desktop\power.csv",'w') as C:
    #     C.write(output)
   
    return Response(
    f'R2: {r2}\nMSE: {mse}\nMAPE: {mape}\nMAD: {mad}\nRMSE {rmse}\n' + output,
        mimetype="text/csv",
        headers={"Content-disposition":
                 "attachment; filename=predicted_sales.csv"})

@app.route('/', methods=['GET'])
def up():
    return "Welcome to My sales Perdiction Pages"

if __name__ == '__main__':
    app.run(debug=False)