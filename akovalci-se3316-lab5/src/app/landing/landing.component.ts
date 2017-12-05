import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {SignupComponent} from '../signup/signup.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  title = 'Space Watch';
  collections=[];
  login:boolean = false;
  signup:boolean = false;
  constructor(){
    //Retrieve all public collections to show on the landing page
     var request = new Request('/api/publicCollections',{
             method: 'GET',
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
          var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  tt.collections = data;
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //Toggle the login variable to true 
  onShowLogin() { 
    this.login = !this.login; 
  };
  //Toggle the sign up variable to true
  onShowSignup() { 
    this.signup = !this.signup; 
  };
  ngOnInit() {
  }

}
