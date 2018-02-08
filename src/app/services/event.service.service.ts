import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {EventListResponse} from '../response/event-list-response';

@Injectable()
export class EventServiceService extends BaseService{
  private uri = '/event';

  constructor(private http: HttpClient ){
      super();
  }
  public getAll(limit: number , offset: number): Observable<EventListResponse> {
    return this.http.get<EventListResponse>(this.API_URL + this.uri + '/get-all/' + limit + '/' + offset);
  }
  public getCount(): Observable<EventListResponse> {
    return this.http.get<EventListResponse>(this.API_URL + this.uri + '/get-count');
  }
}
