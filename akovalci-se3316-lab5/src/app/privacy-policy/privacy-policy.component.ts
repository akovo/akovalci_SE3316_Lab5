import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  policy={name:"privacy",content:"Blah"};
  constructor() {
    //Retrieve the privacy policy for it to be displayed
    var request = new Request('/api/privacy',{
             method: 'GET'
         });
         var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  tt.policy.content = data.content.replace(/&#10;/g,'\n');
                  
                });
            }).catch(err =>{
            console.log(err);
            });
    
  }

  ngOnInit() {
  }

}
