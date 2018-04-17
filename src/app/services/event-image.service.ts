import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EventImage} from '../datamodel/event-image';
import {ReportedImage} from "../datamodel/reported-image";

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
  public deleteReportedEventImages(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    data.append('type','delete')
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/report-image-action', data);
  }
  public ignoreReportedEventImages(eventIds) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    data.append('type','ignore')
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/report-image-action', data);
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
  public send(eventIds, customerName, email, phoneNumber, message, eventId) {
    const  data = new FormData();
    data.append('imageIds', eventIds);
    data.append('customerName', customerName);
    data.append('email', email);
    data.append('phoneNumber', phoneNumber);
    data.append('message', message);
    data.append('eventId', eventId);
    return this.http.post<EventImage[]>(this.API_URL + this.uri + '/send', data);
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
    let data = new HttpParams();
    data = data.set('imageIds', imageIds);
    data = data.set('watermarkId', String(watermarkId));
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
  public getReportedImage(eventId) {
    return this.http.get<ReportedImage[]>(this.API_URL + this.uri + '/reported-image/'+eventId);
  }

}
