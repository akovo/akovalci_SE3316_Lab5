import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginSubmitDirective } from './login-submit.directive'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginSubmitDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
