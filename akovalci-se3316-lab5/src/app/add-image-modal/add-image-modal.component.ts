import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface ConfirmModel {
  title:string;
  message:string;
}
@Component({
  selector: 'app-add-image-modal',
  templateUrl: './add-image-modal.component.html',
  styleUrls: ['./add-image-modal.component.css']
})
export class AddImageModalComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {

  title: string;
  message: string;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  confirm() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
  ngOnInit() {
  }

}
