import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  fields;
  images = [];
  @ViewChild('name') name:ElementRef;
  @ViewChild('desc') desc:ElementRef;
  @ViewChild('pub') pub:ElementRef;
  
  constructor(private route: ActivatedRoute, private auth: AuthService,private router:Router) {
      if(this.auth.getActive()==""){
        this.router.navigate(['']);
      }
      var tt = this;
      this.route.params.subscribe(params => {
        tt.images = params.images.split(',');
        if(tt.images[0]==""){
          tt.images.splice(0,1);
        }
        tt.fields = params;
      });
  }
  ngAfterViewInit() {
    this.name.nativeElement.value  = this.fields.name;
    this.desc.nativeElement.value = this.fields.description;
    if(this.fields.priv == "false"){
      this.pub.nativeElement.checked = true;  
    }
    else{
      this.pub.nativeElement.checked = false;
    }
  }
  removeImage(image){
     var request = new Request('/api/collection',{
             method: 'DELETE',
             body: JSON.stringify({image:image,id:this.fields._id}),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
         var tt = this;
          fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  tt.images = data;
                });
            }).catch(err =>{
            console.log(err);
            });
         
  }
  edit(name,desc,pub,e){
    e.preventDefault();
    var own = this.auth.getActive();
    var priv = !pub;
    var id = this.fields._id;
    var collection = {
      '_id':id,
      name:name,
      description: desc,
      owner: own,
      priv: priv
    }
    console.log(collection);
     var request = new Request('/api/collection',{
             method: 'PUT',
             body: JSON.stringify(collection),
             headers: new Headers({
                 'Content-Type': ' 	application/json',
                 'Access-Control-Allow-Origin':'*'
             })
         });
            fetch(request).then( function(resp){
                resp.json().then(function(data) {
                  console.log(data);
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
