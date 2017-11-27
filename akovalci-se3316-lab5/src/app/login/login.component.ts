import { Component, OnInit, NgModule, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() show: boolean = false;
  constructor() { }
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
            fetch(request).then(resp =>{
                resp.json().then(function(data) {
                  console.log(data);
                });
            }).catch(err =>{
            console.log(err);
            });
    
  }
  ngOnInit() {
  }

}
