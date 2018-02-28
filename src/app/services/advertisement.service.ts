import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Advertisement} from '../datamodel/advertisement';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdvertisementService extends BaseService{
  uri = "/pmv-adv";

  constructor(private http: HttpClient) {
    super();
  }


  public getByEventId(eventId,limit,offset): Observable<Advertisement[]>{

    return this.http.get<Advertisement[]>(this.PUBLIC_API_URL+ this.uri+"/get/"+eventId+"/"+limit+"/"+offset);
  }

}
