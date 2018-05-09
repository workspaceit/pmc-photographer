import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base.service';
import {Photographer} from '../datamodel/photographer';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {OauthCredential} from '../datamodel/oauth.creadential';
import {catchError, tap} from 'rxjs/operators';
import {PhotographerLoginService} from "./photographer-login.service";

@Injectable()
export class LoginService extends BaseService {

  private clientId = 'pmc-app-client';
  private clientSecret = 'f6c3d96bc05036e738f0899ba149f447924b3a09';

  constructor(private http: HttpClient, private photographerLoginService: PhotographerLoginService) {
    super();
  }

  public authenticate(emailOrUsername: string,password: string): Observable<OauthCredential> {

    let params = new HttpParams().set('username',emailOrUsername);
    params = params.set('password',password);
    params = params.set('client_id',this.clientId);
    params = params.set('client_secret',this.clientSecret);
    params = params.set('grant_type','password');



    return this.http.post<OauthCredential>(this.API_BASEURL + '/oauth/token', params)
      .pipe(tap(data => {
        this.photographerLoginService.setOauthCredential(data);
      }));
  }

  public getUserDetails(accessToken: string): Observable<Photographer> {
    let params = new HttpParams().set('access_token',accessToken);
    return this.http.get<Photographer>(this.API_BASEURL + '/auth/api/user-service/get',  {params:params});
  }

  public getUserDetailsAndStoreInLocal(accessToken: string): Observable<Photographer> {
    let params = new HttpParams().set('access_token',accessToken);
    return this.http.get<Photographer>(this.API_BASEURL + '/auth/api/user-service/get',  {params:params}).pipe(
      tap(photographer=>{
          this.photographerLoginService.setCurrentUser(photographer);
        })
    );
  }

}
