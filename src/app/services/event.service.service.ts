import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Event} from '../datamodel/event';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EventServiceService extends BaseService{
  private uri = '/event';

  constructor(private http: HttpClient ){
      super();
  }
  public getAll(limit: number , offset: number): Observable<Event[]> {
    return this.http.get<Event[]>(this.API_URL + this.uri + '/get-all/' + limit + '/' + offset);
  }
}
