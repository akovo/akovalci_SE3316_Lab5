import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { URLSearchParams } from '@angular/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { AddImageModalComponent } from '../add-image-modal/add-image-modal.component';
import { DialogService } from "ng2-bootstrap-modal";
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() results:boolean = false;
  user;
  term;
  page;
  images = [];
  collections= [];
  constructor(private auth: AuthService, private router:Router, private dialogService:DialogService,private sanitizer:DomSanitizer) {
    //ensure that a user is logged in
    this.user = auth.getActive();
    if(this.user ==""){
      this.router.navigate(['']);
    }
    //Retrieve all collection associated with the user name
    this.getCollections();
  }
  //Santitize originalString
  encodeHTML(originalString) {
    var OG = originalString;
    OG = this.sanitizer.sanitize(SecurityContext.HTML,OG);
    return OG;
    }
  //display a modal component to enable the user to select which collections they'd like to add an image to
  showModal(image){
    var coll = this.collections;
    let disposable = this.dialogService.addDialog(AddImageModalComponent, {
      image:image,collections:coll})
      .subscribe((isConfirmed)=>{
        //We get dialog result
        if(isConfirmed) {
            alert('Added');
            this.getCollections();
        }
      });
  }
  //Retrieve all collections asociated with the logged in user
  getCollections(){
    var param = new URLSearchParams;
    param.set('name',this.user);
    var request = new Request('/api/userCollections?'+param,{
             method: 'GET',
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
          var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  tt.collections = data;
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //Runns when a user clicks the next or previous buttons, to search the NASA api for the next page of results for a given search term
  changePage(val){
    if(this.page==1&&val==(-1)){
      alert("Already on first page");
    }
    else{
      this.page = this.page + val;
      this.searchNasa(this.term,this.page);
    }
  }
  
  //Send a GET request to the nasa api with the passed search term and page number 
  //Set the images array to the value of the returned images, enabling them to be displayed
  searchNasa(term,page){
    term = this.encodeHTML(term);
    this.page = page;
    this.term = term;
    this.images = [];
    var param = new URLSearchParams;
    param.set('q',this.term);
    param.set('media_type','image');
    param.set('page',this.page);
    console.log('https://images-api.nasa.gov/search?'+param);
    var request = new Request('https://images-api.nasa.gov/search?'+param,{
             method: 'GET'
         });
         var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  tt.results = true;
                  for(var i = 0; i < data.collection.items.length;i++){
                    tt.images.push(data.collection.items[i].links[0].href)
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  //Runs on click of the remove button associated with a collection, and deletes that collection through a DELETE request to the api
  remove(id){
    var param = new URLSearchParams;
    param.set('id',id);
    param.set('user',this.user);
    var request = new Request('/api/userCollections?'+param,{
             method: 'DELETE',
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
          var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
                  tt.collections = data;
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
  }

}
