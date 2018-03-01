import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  public deleteEventImages(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/delete',data);
  }

  public sendToSlideShow(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/send-to-slideshow',data);
  }

  public addWatermark(imageIds, watermarkId: number) {
    const  data = new FormData();
    data.append('imageIds', imageIds);
    data.append('watermarkId', String(watermarkId));
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/add-watermark', data);
  }

  public removeWatermark(imageIds) {
    const  data = new FormData();
    data.append('imageIds', imageIds);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/remove-watermark', data);
  }

}
