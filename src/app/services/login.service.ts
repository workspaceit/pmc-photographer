import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base.service';
import {Photographer} from '../datamodel/photographer';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {OauthCredential} from '../datamodel/oauth.creadential';
import {catchError, tap} from 'rxjs/operators';
import {LocationListResponseData} from '../response-data-model/location-list-response-data';

@Injectable()
export class LoginService extends BaseService{

  curentUserKey= 'currentUser';
  oauthCredentialKey= 'oauthCredential';
  clientId = 'pmc-app-client';
  clientSecret = 'f6c3d96bc05036e738f0899ba149f447924b3a09';

  constructor(private http: HttpClient ) {
    super();
  }

  public authenticate(emailOrUsername: string,password: string): Observable<OauthCredential> {

    let params = new HttpParams().set('username',emailOrUsername);
    params = params.set('password',password);
    params = params.set('client_id',this.clientId);
    params = params.set('client_secret',this.clientSecret);
    params = params.set('grant_type','password');






    return this.http.post<OauthCredential>(this.API_BASEURL + '/oauth/token', null, {params:params}).pipe(
                                                        tap(data => {

                                                          localStorage.setItem(this.oauthCredentialKey,JSON.stringify(data));
                                                          console.log(localStorage.getItem(this.oauthCredentialKey));
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
          localStorage.setItem(this.curentUserKey,JSON.stringify(photographer));
          console.log(localStorage.getItem(this.oauthCredentialKey));
        })
    );
  }
  public getLocalUserDetails(): Photographer{
    return JSON.parse(localStorage.getItem(this.curentUserKey));
  }
  public getLocalOauthCredential(): Photographer{
    return JSON.parse(localStorage.getItem(this.oauthCredentialKey));
  }
}
