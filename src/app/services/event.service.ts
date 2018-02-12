import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {EventListResponseData} from '../response/event-list-response';

@Injectable()

export class EventService extends BaseService {
  private uri = '/events';

  constructor(private http: HttpClient ) {
      super();
  }
  public getAll(locationId: number, limit: number , offset: number): Observable<EventListResponseData> {
    const params = new HttpParams().set('locationId', String(locationId));
    return this.http.get<EventListResponseData>(this.API_URL + this.uri + '/' + limit + '/' + offset, {'params': params});
  }
  /*public getCount(): Observable<EventListResponse> {
    return this.http.get<EventListResponse>(this.API_URL + this.uri + '/get-count');
  }*/
}
