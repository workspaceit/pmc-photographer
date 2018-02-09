import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {Venue} from '../datamodel/venue';
import {HttpClient, HttpParams} from '@angular/common/http';
import {VenueListResponseData} from '../response-data-model/venue-list-response-data';

@Injectable()
export class VenueService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  // API: GET /venues
  public getVenuesByLocation (locationId: number, limit: number, offset: number): Observable<VenueListResponseData> {
    const params = new HttpParams().set('locationId', String(locationId));
    return this.http.get<VenueListResponseData>(this.API_URL + '/venues/' + limit + '/' + offset + '/', {params: params})
      .pipe(
        tap(venues => this.log('fetched venues')),
        catchError(this.handleError('getVenues', null))
      );
  }

}
