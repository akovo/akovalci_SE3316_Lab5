import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css']
})
export class NewCollectionComponent implements OnInit {

  constructor(private auth: AuthService, private router:Router,private sanitizer:DomSanitizer) {
    //Check that a user is logged in
    var own = this.auth.getActive();
    if(own ==""){
      this.router.navigate(['']);
    }
  }
  //Sanitize originalString
  encodeHTML(originalString) {
    var OG = originalString;
    OG = this.sanitizer.sanitize(SecurityContext.HTML,OG);
    return OG;
  }
  /**
  Runs on click of the submit button
  Sends a POST request to the API with all fields necessary to add a new collection
  **/
  add(name,desc,pub,e){
    e.preventDefault();
    name = this.encodeHTML(name);
    desc = this.encodeHTML(desc);
    var own = this.auth.getActive();
    var priv = !pub;
    var collection = {
      name:name,
      description: desc,
      owner: own,
      priv: priv
    }
    console.log(collection);
     var request = new Request('/api/collection',{
             method: 'POST',
             body: JSON.stringify(collection),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  //let the user know a collection has been saved
                  if(data.message=="Saved"){
                      alert("Collection saved");
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  
  ngOnInit() {
  }

}
