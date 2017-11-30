import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { URLSearchParams } from '@angular/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { AddImageModalComponent } from '../add-image-modal/add-image-modal.component';
import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user;
  images = [];
  collections= [];
  constructor(private auth: AuthService, private router:Router, private dialogService:DialogService) {
    this.user = auth.getActive();
    if(this.user ==""){
      this.router.navigate(['']);
    }
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
  showModal(image){
    let disposable = this.dialogService.addDialog(AddImageModalComponent, {
      title:'Confirm title', 
      message:'Confirm message'})
      .subscribe((isConfirmed)=>{
        //We get dialog result
        if(isConfirmed) {
            alert('accepted');
        }
        else {
            alert('declined');
        }
      });
  }
  searchNasa(term){
    this.images = [];
    var param = new URLSearchParams;
    param.set('q',term);
    param.set('media_type','image');
    console.log('https://images-api.nasa.gov/search?'+param);
    var request = new Request('https://images-api.nasa.gov/search?'+param,{
             method: 'GET',
             headers: new Headers({
                 'Content-Type': ' 	application/json'
             })
         });
         var tt = this;
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  for(var i = 0; i < data.collection.items.length;i++){
                    tt.images.push(data.collection.items[i].links[0].href)
                  }
                });
            }).catch(err =>{
            console.log(err);
            });
  }
  
  
  
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
