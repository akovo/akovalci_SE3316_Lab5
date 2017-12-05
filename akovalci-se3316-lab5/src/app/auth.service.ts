import { Injectable } from '@angular/core';

/**
This service is present globally to track when a user is logged in, and their admin status
**/
@Injectable()
export class AuthService {
    private activeUser="";
    private admin = false;
    //Set the value of the active user and the admin status 
    setActive(val,ad) {
        this.activeUser = val;
        this.admin = ad;
    }
    //return the active user
    getActive() {
        return this.activeUser ;
    }
    //Return whether the user is an admin
    getAdmin(){
        return this.admin;
    }
  constructor() { }

}
