import { Injectable } from '@angular/core';
import {Photographer} from "../datamodel/photographer";
import {OauthCredential} from "../datamodel/oauth.creadential";

@Injectable()
export class PhotographerLoginService {

  private currentUserKey= 'currentUser';
  private oauthCredentialKey= 'oauthCredential';


  constructor() { }

  setOauthCredential(data) {
    localStorage.setItem(this.oauthCredentialKey, JSON.stringify(data));
    console.log(localStorage.getItem(this.oauthCredentialKey));
  }

  setCurrentUser(photographer: Photographer){
    localStorage.setItem(this.currentUserKey, JSON.stringify(photographer));
    console.log(localStorage.getItem(this.oauthCredentialKey));
  }

  public getLocalUserDetails(): Photographer{
    return JSON.parse(localStorage.getItem(this.currentUserKey));
  }

  public getLocalOauthCredential(): OauthCredential {
    return JSON.parse(localStorage.getItem(this.oauthCredentialKey));
  }

  public removeLocalUserDetails() {
    localStorage.removeItem(this.currentUserKey);
  }

  public removeLocalOauthCredential() {
    localStorage.removeItem(this.oauthCredentialKey);
  }

  public isLoggedIn(): boolean {
    return this.getLocalUserDetails() !== null;
  }

}
