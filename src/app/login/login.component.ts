import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  formdata = {email:"",password:""}
  submit=false;
  loading=false;
  errorMessage="";
  
  constructor(private auth:AuthService) { }

  ngOnInit():void{
    this.auth.canAuthen();
  }
  
  onSubmit(){
    this.loading=true;
    this.auth.login(this.formdata.email,this.formdata.password)
    .subscribe({
      next:data=>{
        this.auth.storeToken(data.idToken);
        console.log('Logged user token is '+data.idToken);
        this.auth.canAuthen();
      },
      error:data=>{
        if(data.error.error.message=="INVALID_PASSWORD" || data.error.error.message=="INVALID_EMAIL"){
          this.errorMessage="Invalid Credentials";
        }else{
          this.errorMessage="Unknown error occured";
        }
      }
    }).add(()=>{
      this.loading=false;
    })
  }
}