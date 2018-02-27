import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {EventListResponseData} from '../response-data-model/event-list-response-data';
import {EventDetailsResponseData} from '../response-data-model/event-details-response-data';
import {OauthCredential} from '../datamodel/oauth.creadential';
import {LoginService} from './login.service';

@Injectable()

export class EventService extends BaseService {
  private uri = '/events';

  constructor(private http: HttpClient, private loginService: LoginService) {
      super();
  }

  public getEventDetails(eventId: number) {
    return this.http.get<EventDetailsResponseData>(this.API_URL + this.uri + '/' + eventId + '/details');
  }

  public getAll(locationId: number, filterDate: string, limit: number , offset: number): Observable<EventListResponseData> {
    // let data = {'locationId': locationId};
    const data = new FormData();
    console.log(this.loginService.getLocalOauthCredential().access_token);
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': 'Bearer ' + this.loginService.getLocalOauthCredential().access_token
    //   })
    // };
    data.append('locationId', locationId.toString());
    if (filterDate) {
      data.append('filterDate', filterDate);
    }
    // return this.http.post<EventListResponseData>('http://localhost:8080/auth/api' + this.uri + '/' + limit + '/' + offset, data,
    //   httpOptions);
    return this.http.post<EventListResponseData>(this.API_URL + this.uri + '/' + limit + '/' + offset, data);
  }
}
