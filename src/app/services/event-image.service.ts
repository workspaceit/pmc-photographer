import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {EventImage} from '../datamodel/event-image';

@Injectable()
export class EventImageService extends  BaseService {

  private uri = '/event-images';

  constructor(private http: HttpClient) {
    super();
  }

  public getEventImages(eventId: number, limit: number , offset: number): Observable<EventImage[]> {
    const data = new FormData();
    data.append('eventId', eventId.toString());
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/' + limit + '/' + offset, data);
  }

}
