import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {Venue} from '../datamodel/venue';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VenueService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  // API: GET /venues
  public getVenuesByLocation (locationId: number): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.API_URL + '/venue/?locationId=' + locationId)
      .pipe(
        tap(venues => this.log('fetched venues')),
        catchError(this.handleError('getVenues', []))
      );
  }

}
