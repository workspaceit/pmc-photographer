import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Photographer} from "../datamodel/photographer";

@Injectable()
export class ResetpasswordService extends BaseService {
  private uri = '/reset-password';
  constructor(private http: HttpClient) {
    super();
  }

  public sendResetPasswordToken(email:string) {
    const data = new FormData();
    data.append("email",email);
    return this.http.post<Photographer>(this.PUBLIC_API_URL + this.uri+"/generate", data);

  }

  public verifyPasswordToken(id:number,token:string) {
    const data = new FormData();
    data.append("photographerId",id.toString());
    data.append("token",token);
    return this.http.post<Photographer>(this.PUBLIC_API_URL + this.uri+"/verify", data);

  }

  public updatePassword(id:number,password:string) {
    const data = new FormData();
    data.append("photographerId",id.toString());
    data.append("password",password);
    return this.http.post<Photographer>(this.PUBLIC_API_URL + this.uri+"/update-password", data);

  }

}
