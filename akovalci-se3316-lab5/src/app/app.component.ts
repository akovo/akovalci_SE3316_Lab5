import { Component } from '@angular/core';
import {LoginComponent} from './login/login.component'
import {SignupComponent} from './signup/signup.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Space Watch';
  login:boolean = false;
  signup:boolean = false;
  onShowLogin() { 
    console.log('login');
    this.login = !this.login; 
  };
  onShowSignup() { 
    console.log('signup');
    this.signup = !this.signup; 
  };
}
