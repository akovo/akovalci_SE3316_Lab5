import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AuthService } from '../auth.service';
import { URLSearchParams } from '@angular/http';

export interface ConfirmModel {
  image:string,
  collections:any[]
}
@Component({
  selector: 'app-add-image-modal',
  templateUrl: './add-image-modal.component.html',
  styleUrls: ['./add-image-modal.component.css']
})
export class AddImageModalComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  image: string;
  collections:any[];
  toAdd = [];
  constructor(dialogService: DialogService, private auth:AuthService) {
    super(dialogService);
  }
  confirm() {
    
    var request = new Request('/api/images',{
       method: 'PUT',
       body: JSON.stringify({collections:this.toAdd,image:this.image}),
       headers: new Headers({
           'Content-Type': ' 	application/json'
       })
    });
    var tt = this;
      fetch(request).then( function(resp){
          resp.json().then(function(data) {
            tt.close();
          });
      }).catch(err =>{
        console.log(err);
      });
    this.result = true;
  }
  ngOnInit() {
  }
  onChange(id,e){
    if(e.target.checked ===true){
      this.toAdd.push(id);
      console.log(this.toAdd);
    }
    if(e.target.checked ===false){
      var i = this.toAdd.indexOf(id);
      this.toAdd.splice(i,1);
      console.log(this.toAdd);
    }
  }

}
