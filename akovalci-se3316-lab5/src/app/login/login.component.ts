import { Component, OnInit, NgModule, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() show:boolean = false;
  constructor(private auth: AuthService, private router: Router) {
  }
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
          console.log(_this);
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  if(data.message=="Success!"){
                      _this.auth.setActive(user);
                      _this.router.navigate(['home']);
                  }
                  else if(data.message=="User not verified!"){
                      alert("User not verified");
                  }
                  else{
                    alert(data.message);
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
    
  }
  ngOnInit() {
  }

}
