import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { URLSearchParams } from '@angular/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
    //Place holders for the policies, logs and searched collections
  dmcaPolicy="";
  privacyPolicy="";
  logs=[];
  displayedCollections=[];
  logType="";
  constructor(private auth:AuthService, private router:Router,private sanitizer:DomSanitizer) {
      //Check the auth service to ensure that an admin is signed in, and redirect otherwise
    if(this.auth.getActive()=="" || this.auth.getAdmin() ==false){
      this.router.navigate(['']);
    }
    //Retrieve logs and policies
    this.getLogs();
    this.getPolicy('dmca');
    this.getPolicy('privacy');
  }
  //Function whic runs on click of the save button associated with a policy field. This sends a put request to the API to update the policy based on the endpoint
  savePolicy(type,content,e){
      e.preventDefault();
      content = this.encodeHTML(content);
        var request = new Request('/api/'+type,{
             method: 'PUT',
             body: JSON.stringify({content:content}),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  alert(data.message);
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //This function retrieves a policy based on the type associated with the request ('dmca' or 'privacy') and assigns it to the class variable of that type
  //This in turn populates the textarea to enable editing of the policy
  getPolicy(type){
       var request = new Request('/api/'+type,{
             method: 'GET'
         });
         var tt = this;
          fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  if(data.name=="DMCA"){
                      tt.dmcaPolicy = data.content.replace(/&#10;/g,'\n');
                  }
                  if(data.name=="privacy"){
                      tt.privacyPolicy = data.content.replace(/&#10;/g,'\n');
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //Runs everytime a log type is changed based on the log radio buttons, so that the correct log can be saved
  type(lType){
    this.logType=lType;
    console.log(this.logType);
  }
  /**
  *Function that runs on click of submit to submit a log
  * Posts a new log of the entered content and the currently selected type to the log collection
  **/
  log(e,content){
    e.preventDefault();
    content = this.encodeHTML(content);
    console.log(content);
    var request = new Request('/api/log',{
             method: 'POST',
             body: JSON.stringify({type:this.logType,description:content}),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var tt =this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  //Refresh the logs if the log is successfully saved
                  if(data.message=="log saved"){
                      alert(data.message);
                      tt.getLogs();
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  /**
  * This function uses a GET request to get all logs stored in the database, 
  * and pass them to the local class 'logs' variable, in order to be displayed
  **/
  getLogs(){
     var request = new Request('/api/log',{
             method: 'GET',
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var tt =this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  tt.logs = data;
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  /**
    Search for collections by name using a GET request, 
    used to retrieve collections which may be disabled or enabled
  **/
  searchCollections(key){
    key = this.encodeHTML(key);
     console.log(this.dmcaPolicy + " " + this.privacyPolicy);
    var param = new URLSearchParams;
    param.set('name',key);
    var request = new Request('/api/adminCollections?'+param,{
             method: 'GET',
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var tt =this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  tt.displayedCollections = data;
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //Runs when the disable or enable button for a retrieved collection is clicked
  //Changes the state of the collection using a PUT request 
  changeState(id,state,owner,name){
    var request = new Request('/api/collectionState',{
             method: 'PUT',
             body: JSON.stringify({id:id,state:state,owner:owner,name:name}),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var tt =this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  if(data.message=="state changed"){
                      alert(data.message);
                      tt.displayedCollections=[];
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //Sanitize originalString value
  encodeHTML(originalString) {
    var OG = originalString;
    OG = this.sanitizer.sanitize(SecurityContext.HTML,OG);
    return OG;
    }
  ngOnInit() {
  }

}
