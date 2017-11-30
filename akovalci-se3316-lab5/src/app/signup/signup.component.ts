import { Component, OnInit, Input,ViewChild, ElementRef } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    @Input() show:boolean = false;
    @ViewChild('Suser') userInput:ElementRef;
  constructor(private auth: AuthService) { 
  }
  Signup(user,pass, e){
    e.preventDefault()
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
              tt.userInput.nativeElement.value = "";
            });
    }).catch(err =>{
        console.log(err);
  });
  }
  ngOnInit() {
  }

}
