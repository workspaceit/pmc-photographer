///<reference path="../../../node_modules/@angular/common/http/src/client.d.ts"/>
import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {LocationListResponse} from '../response/location-list-response';


@Injectable()
export class LocationService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  // API: GET /locations
  public getLocations (limit: number, offset: number): Observable<LocationListResponse> {
    /*
    return this.http.get<LocationListResponse>(this.API_URL + '/location/' + limit + '/' + offset + '/')
      .pipe(
        tap(locationListResponse => this.log(`fetched locations`)),
        catchError(this.handleError('getLocations', []))
      );*/

    return this.http.get<LocationListResponse>(this.API_URL + '/location/' + limit + '/' + offset + '/');
  }
}
