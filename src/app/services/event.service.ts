import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {EventListResponseData} from '../response-data-model/event-list-response-data';
import {EventDetailsResponseData} from '../response-data-model/event-details-response-data';

@Injectable()

export class EventService extends BaseService {
  private uri = '/events';

  constructor(private http: HttpClient ) {
      super();
  }

  public getEventDetails(eventId: number) {
    return this.http.get<EventDetailsResponseData>(this.API_URL + this.uri + '/' + eventId + '/details');
  }

  public getAll(locationId: number, filterDate: string, limit: number , offset: number): Observable<EventListResponseData> {
    // let data = {'locationId': locationId};
    const data = new FormData();
    data.append('locationId', locationId.toString());
    if (filterDate) {
      data.append('filterDate', filterDate);
    }
    return this.http.post<EventListResponseData>(this.API_URL + this.uri + '/' + limit + '/' + offset, data);
  }
}
