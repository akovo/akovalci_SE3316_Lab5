import { Component, OnInit, Input,ViewChild, ElementRef, Sanitizer,SecurityContext } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    @Input() show:boolean = false;
  constructor(private auth: AuthService,private sanitizer:DomSanitizer) { 
  }
  //Sanitize originalString
  encodeHTML(originalString) {
    var OG = originalString;
    OG = this.sanitizer.sanitize(SecurityContext.HTML,OG);
    return OG;
    }
    //Runs on click of the Submit button, attempting to POST the username password and admin privelages to the API
    //Posts to different endpoint based on admin sign up
  Signup(user,pass,admin,code,e){
    e.preventDefault();
    pass = this.encodeHTML(pass);
    code = this.encodeHTML(code);
    var endpoint;
    if(admin){
        endpoint = '/api/addAdmin';
    }
    else{
        endpoint = '/api/users';
    }
     var request = new Request(endpoint,{
         method: 'POST',
         body: JSON.stringify({"name":user,"pass":pass,"secretKey":code}),
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
