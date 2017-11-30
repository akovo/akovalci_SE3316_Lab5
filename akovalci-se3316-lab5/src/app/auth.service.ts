import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    private activeUser="";
    setActive(val) {
        this.activeUser = val;
    }

    getActive() {
        return this.activeUser ;
    }
  constructor() { }

}
