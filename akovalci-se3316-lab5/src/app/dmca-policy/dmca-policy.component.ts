import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dmca-policy',
  templateUrl: './dmca-policy.component.html',
  styleUrls: ['./dmca-policy.component.css']
})
export class DmcaPolicyComponent implements OnInit {
  policy={name:"DMCA",content:"Blah"};
  constructor() {
    //GET the DMCA policy and add it to policy.content to display it
    var request = new Request('/api/dmca',{
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
