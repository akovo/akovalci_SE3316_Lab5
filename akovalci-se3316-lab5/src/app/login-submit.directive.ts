import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appLoginSubmit]',
  host:{
    '(click)':'onClick()'
  }
})
export class LoginSubmitDirective {
  @Input() username: string;
  @Input() password: string;
  constructor() { }
  onClick(){
    console.log(this.username);
    console.log(this.password);
    console.log("Im here")
  }
  
}
