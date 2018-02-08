import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base.service';
import {Photographer} from '../datamodel/photographer';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {OauthCredential} from '../datamodel/oauth.creadential';

@Injectable()
export class LoginService extends BaseService{

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

    return this.http.post<OauthCredential>(this.API_BASEURL + '/oauth/token', null, {params:params});
  }

  public getUserDetails(accessToken: string): Observable<Photographer> {

    let params = new HttpParams().set('access_token',accessToken);

      return this.http.get<Photographer>(this.API_BASEURL + '/auth/api/user-service/get',  {params:params});
  }
}
