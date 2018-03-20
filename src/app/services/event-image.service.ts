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
  public getEventImagesBySlideShowIdentifier(identifier: string): Observable<EventImage[]> {
    return this.http.get<EventImage[]>(this.PUBLIC_API_URL + this.uri + '/get/' + identifier);
  }
  public getEventImages(eventId: number, limit: number , offset: number): Observable<EventImage[]> {
    console.log(offset);
    const data = new FormData();
    data.append('eventId', eventId.toString());
    data.append('eventId', eventId.toString());
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/' + limit + '/' + offset, data);
  }
  public getEventImagesByEventIdWhereIsSentSlideShowTrue(eventId: number): Observable<EventImage[]> {
    return this.http.get<EventImage[]>(this.PUBLIC_API_URL + this.uri + '/get-by-event-id-where-is-sent-slide-show-true/'+eventId);
  }

  public getEventImagesFromSlideshow(eventId: number, limit: number , offset: number): Observable<EventImage[]> {
    console.log(offset);
    const data = new FormData();
    data.append('eventId', eventId.toString());
    data.append('eventId', eventId.toString());
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/' + limit + '/' + offset + '/in-slideshow', data);
  }

  public deleteEventImages(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/delete', data);
  }

  public sendToSlideShow(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/send-to-slideshow', data);
  }

  public removeFromSlideShow(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/remove-from-slideshow', data);
  }
  public sendViaEmail(eventIds,customerName,email,message,eventId) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    data.append('customerName',customerName);
    data.append('email',email);
    data.append('message',message);
    data.append('eventId',eventId);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/send-via-email', data);
  }

  public sendViaSms(eventIds,customerName,phoneNum,message,eventId) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    data.append('customerName',customerName);
    data.append('phoneNum',phoneNum);
    data.append('message',message);
    data.append('eventId',eventId);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/send-via-sms', data);
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
  public reportImage(imageId) {
    const  data = new FormData();
    data.append('eventImageId', imageId);
    return this.http.post<EventImage>(this.PUBLIC_API_URL + this.uri + '/report-image', data);
  }

}
