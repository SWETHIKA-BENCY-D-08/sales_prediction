import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formdata={
    name:"",
    email:"",
    password:""
  }
  submit=false;
  errorMessage="";
  loading=false;
  
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.auth.canAuthen();

  }
  
  onSubmit(){
    this.loading=true;

    this.auth.register(this.formdata.name, this.formdata.email, this.formdata.password)
    .subscribe({
      next:data=>{
        //stores token from response
        this.auth.storeToken(data.idToken);   
        console.log('Registered idToken is ' + data.idToken)   
        this.auth.canAuthen(); 
      },
      error:data=>{
        if(data.error.error.message=="INVALID_EMAIL"){
          this.errorMessage="Invalid Email"
        }
        else if(data.error.error.message=="EMAIL_EXISTS"){
          this.errorMessage="Email already exists"
        }
        else{
          this.errorMessage="Unknown error occured"
        }
      }
    }).add(()=>{
      this.loading=false;
      console.log('Register Completed')
    })
  }
}