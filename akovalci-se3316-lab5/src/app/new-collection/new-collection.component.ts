import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css']
})
export class NewCollectionComponent implements OnInit {

  constructor(private auth: AuthService, private router:Router) {
    var own = this.auth.getActive();
    if(own ==""){
      this.router.navigate(['']);
    }
  }
  
  add(name,desc,pub,e){
    e.preventDefault();
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
                  if(data.message=="Success!"){
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
