import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  fields;
  @ViewChild('name') name:ElementRef;
  @ViewChild('desc') desc:ElementRef;
  @ViewChild('pub') pub:ElementRef;
  
  constructor(private route: ActivatedRoute, private auth: AuthService) {
      var tt = this;
      console.log(tt.name);
      this.route.params.subscribe(params => {
        // Defaults to 0 if no query param provided.
        tt.fields = params;

      });
      console.log(this.fields);
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
