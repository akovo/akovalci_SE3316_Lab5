import { Component, OnInit, NgModule, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() show:boolean = false;
  @Input() reVerify:boolean = false;
  constructor(private auth: AuthService, private router: Router) {
  }
  /**
   * Attempts to validate the user by sending their credentials to the API
   * The API either returns success or provides a message for failure
   **/
  Login(user,pass,e){
        e.preventDefault();
        var request = new Request('/api/login',{
             method: 'POST',
             body: JSON.stringify({"name":user,"pass":pass}),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var _this = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  if(data.message=="Success!"){
                      //navigate to user page
                      _this.auth.setActive(user,false);
                      _this.router.navigate(['home']);
                  }
                  else if(data.message=="Admin Success"){
                      //navigate to admin page
                    _this.auth.setActive(user,true);
                    _this.router.navigate(['admin']);
                  }
                  else if(data.message=="User not verified!"){
                      //enable the button to resend the verification email
                      alert("User not verified");
                      _this.reVerify = true;
                      
                  }
                  else{
                    alert(data.message);
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
    
  }
  //Runs on button click to resend the users verification email based the field entered to attempt a log in
  resend(user){
     var request = new Request('/api/resend',{
             method: 'put',
             body: JSON.stringify({"name":user}),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var _this = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  if(data.message=="Success!"){
                      //remove the resend button
                      _this.reVerify = false;
                      alert("email resent!");
                      
                }});
            }).catch(err =>{
            console.log(err);
            });
         
  }
  ngOnInit() {
  }

}
