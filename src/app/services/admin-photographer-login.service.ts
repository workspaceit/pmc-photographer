import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {Observable} from "rxjs/Observable";
import {Photographer} from "../datamodel/photographer";
import {HttpClient, HttpParams} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {OauthCredential} from "../datamodel/oauth.creadential";
import {PhotographerLoginService} from "./photographer-login.service";

@Injectable()
export class AdminPhotographerLoginService extends BaseService {

  private uri = '/photographers';

  constructor(private http: HttpClient, private photographerLoginService: PhotographerLoginService) { super(); }

  public getPhotographers(): Observable<Photographer[]> {
    return this.http.get<Photographer[]>(this.API_URL + this.uri + "/");
  }

  public loginAsPhotographer(photographer: Photographer){
    let params = new HttpParams().set('photographerId', String(photographer.id));
    return this.http.post<OauthCredential>(this.API_URL + '/user-service/login-as-photographer',params)
      .pipe(tap(data => {
        this.photographerLoginService.setOauthCredential(data);
      }));
  }

}
