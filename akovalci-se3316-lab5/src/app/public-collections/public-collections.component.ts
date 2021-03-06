import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router } from '@angular/router';
@Component({
  selector: 'app-public-collections',
  templateUrl: './public-collections.component.html',
  styleUrls: ['./public-collections.component.css']
})
export class PublicCollectionsComponent implements OnInit {
  collections;
  user;
  constructor(private router:Router, private auth:AuthService) {
    //ensure that a user is logged in
    if(this.auth.getActive()==""){
        this.router.navigate(['']);
    }
    this.user = this.auth.getActive();
    this.getCollections();
    
  }
  //GET all collections whose owner is not the user
  getCollections(){
     var param = new URLSearchParams;
    param.set('name',this.user);
    var request = new Request('/api/browseCollections?'+param,{
             method: 'GET',
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
          var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  //Set the collections to be displayed 
                  tt.collections = data;
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  /**
   * Rate a collection by sending a put request containing the rating entered, the collection to rate, and the user
   **/
  rateCollection(collection,rate,e){
      e.preventDefault();
      console.log("here")
      var request = new Request('/api/rate',{
            method: 'PUT',
            body: JSON.stringify({collection:collection,rate:rate,user:this.user}),
            headers: new Headers({
                'Content-Type': ' 	application/json',
                'Access-Control-Allow-Origin':'*'
            })
        });
        var tt = this;
        fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  if(data.message=="rated"){
                    //Retrieve collections to show updated ratings
                    alert(data.message);
                    tt.getCollections();
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }

  ngOnInit() {
  }

}
