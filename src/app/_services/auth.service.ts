import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router, private http:HttpClient) { }

  isAuthenticated():boolean{
    if(sessionStorage.getItem('token')!== null){
      return true;
    }  
    return false;
  }

  canAccess(){
    if(!this.isAuthenticated()){
        this.router.navigate(['/login']);
    }
  }
  canAuthen(){
    if(this.isAuthenticated()){
      this.router.navigate(['/dashboard']);
    }
  }
  register(name:string, email:string, password:string){

    return this.http.post<{idToken:string}>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBdK07fNDHMTTLJzfo2L7Fs3-yIhM0vWKA', {
      displayName:name, email:email,password:password
    });
  }

  storeToken(token:string){
    sessionStorage.setItem('token',token);
  }
  login(email:string,password:string){
    return this.http.post<{idToken:string}>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdK07fNDHMTTLJzfo2L7Fs3-yIhM0vWKA',{
      email:email,password:password
    });
  } 

  details(){
    let token = sessionStorage.getItem('token');
    return this.http.post<{users:Array<{name:string}>}>('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBdK07fNDHMTTLJzfo2L7Fs3-yIhM0vWKA',{
        idToken:token
    })
  }
  removeToken(){
    sessionStorage.removeItem('token');
  }

}