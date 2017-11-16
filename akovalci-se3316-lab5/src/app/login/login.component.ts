import { Component, OnInit, NgModule } from '@angular/core';
import { Http} from '@angular/http';
import * as $ from 'jquery'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor() { }
  Login(user,pass){
    console.log(user);
    console.log(pass);
     var request = new Request('/api/login',{
         method: 'POST',
         body: JSON.stringify({"name":user,"pass":pass}),
         headers: new Headers({
             'Content-Type': ' 	application/json',
             'Access-Control-Allow-Origin':'*'
         })
     });
    fetch(request).then(resp =>{
        resp.json().then(function(data) {
              console.log(data);
            });
    }).catch(err =>{
        console.log(err);
  });
     fetch('/api/').then(resp =>{
        console.log(resp);
            resp.json().then(function(data) {
              console.log(data);
            });
    });
  }
  ngOnInit() {
  }

}
