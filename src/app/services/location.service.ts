import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {LocationListResponseData} from '../response-data-model/location-list-response-data';


@Injectable()
export class LocationService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  // Get Active Location Count and Paginated List
  public getLocations (limit: number, offset: number): Observable<LocationListResponseData> {
    return this.http.get<LocationListResponseData>(this.API_URL + '/location/' + limit + '/' + offset + '/')
      .pipe(
        tap(data => this.log(`fetched locations`)),
        catchError(this.handleError<LocationListResponseData>('getLocationsListResponse', null))
      );
  }

}
