import { Component, OnInit, Input,ViewChild, ElementRef, Sanitizer,SecurityContext } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    @Input() show:boolean = false;
  constructor(private auth: AuthService, private sanitizer:Sanitizer) { 
  }
  Signup(user,pass, e){
    e.preventDefault();
    console.log(user + " " + pass);
    var active = this.auth.getActive();
     console.log(active);
    
     var request = new Request('/api/users',{
         method: 'POST',
         body: JSON.stringify({"name":user,"pass":pass}),
         headers: new Headers({
             'Content-Type': ' 	application/json',
             'Access-Control-Allow-Origin':'*'
         })
     });
     var tt = this;
    fetch(request).then(resp =>{
        resp.json().then(function(data) {
              alert(data.message);
            });
    }).catch(err =>{
        console.log(err);
  });
  }
  ngOnInit() {
  }

}
