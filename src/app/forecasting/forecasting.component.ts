import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forecasting',
  templateUrl: './forecasting.component.html',
  styleUrls: ['./forecasting.component.css']
})
export class ForecastingComponent implements OnInit {

  public labelss: string[] = [];
  public datas: number[] = [];
  chartData: any = [];
  Metrics:any=[];
  r2:any=[];
     
  constructor(private route: ActivatedRoute, private router: Router) { }


  chatdata = {
    labels: this.labelss,
    datasets: [{
      label: 'Sales Perdiction',
      data: this.datas,
      borderColor: 'rgb(225,215, 0)',
      tension: 0.1,
      hoverBackgroundColor: 'rgb(255, 215, 0)',
      pointBackgroundColor: 'rgb(0,0, 0)'
    }]
  };



  ngOnInit(): void {
    this.chartData = history.state.chartData;
    
  this.chartData=this.chartData.slice(6)
  this.chartData.map((row: any) => {
  // Check if the row is not an empty array
  if (row.length > 1) {
    this.labelss.push(row[1] as string); // Cast row[0] to string and push onto labelss
    this.datas.push(Number(row[2]) as number);  // Add the second element of the row as a number to the data array
  }
  this.Metrics=history.state.Metrics;
  this.r2=history.state.R2;
});
    console.log('Chart Data:', this.chartData);  
  }

  onChangePower() {
    this.router.navigate(['/powerbi']);
  }

}