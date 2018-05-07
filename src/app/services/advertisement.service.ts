import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Advertisement} from '../datamodel/advertisement';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {AdvertisementDetails} from '../datamodel/advertisement.details';

@Injectable()
export class AdvertisementService extends BaseService{

  public static advTypeReqParamenter={
    GALLERY:"gallery",
    SLIDESHOW:"slideshow",
    POPUP_SMS:"popup_sms",
    POPUP_EMAIL:"popup_email"
  };

  uri = "/pmv-adv";
  constructor(private http: HttpClient) {
    super();
  }


  public getByEventId(eventId:number,limit:number,offset:number): Observable<Advertisement[]>{

    return this.http.get<Advertisement[]>(this.PUBLIC_API_URL+ this.uri+"/get/"+eventId+"/"+limit+"/"+offset);
  }
  public getBySentSlideShowIdentifierAndType(identifier:string, adType:string, limit:number, offset:number): Observable<Advertisement[]>{

    return this.http.get<Advertisement[]>(this.PUBLIC_API_URL+ this.uri+"/get/"+adType+"/"+identifier+"/"+limit+"/"+offset);
  }
  public getAllBySentSlideShowIdentifierAndType(identifier:string, adType:string): Observable<Advertisement[]>{

    return this.http.get<Advertisement[]>(this.PUBLIC_API_URL+ this.uri+"/get-all/"+adType+"/"+identifier);
  }
  public getById(id): Observable<AdvertisementDetails>{

    return this.http.get<AdvertisementDetails>(this.PUBLIC_API_URL+ this.uri+"/get/"+id);
  }
  public getBySentSlideShowByEventIdAndType(eventId:number, adType:string): Observable<AdvertisementDetails[]>{

    return this.http.get<AdvertisementDetails[]>(this.PUBLIC_API_URL+ this.uri+"/get/"+adType+"/"+eventId);
  }
}
