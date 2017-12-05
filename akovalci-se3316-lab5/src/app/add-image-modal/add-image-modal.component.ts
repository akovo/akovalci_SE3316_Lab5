import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AuthService } from '../auth.service';
import { URLSearchParams } from '@angular/http';
//Values imported from the component intializing the modal
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
  //list of collections which the image will be added to
  toAdd = [];
  constructor(dialogService: DialogService, private auth:AuthService) {
    super(dialogService);
  }
  /**
   * The confirm method sends an array of collections to the API through a put, along with the image URL.
   * The image URL is appended to the images array of each collection
   **/
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
            //close the modal
            tt.close();
          });
      }).catch(err =>{
        console.log(err);
      });
    this.result = true;
  }
  ngOnInit() {
  }
  /**
  *
  * This method runs each time a checkbox is checked or unchecked, to either add or remove that collection from the toAdd array
  **/
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
