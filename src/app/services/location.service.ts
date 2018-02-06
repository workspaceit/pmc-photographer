import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Location} from '../datamodel/location';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';


@Injectable()
export class LocationService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  // API: GET /locations
  public getLocations (): Observable<Location[]> {
    return this.http.get<Location[]>(this.API_URL + '/location/')
      .pipe(
        tap(locations => this.log(`fetched locations`)),
        catchError(this.handleError('getLocations', []))
      );
  }


























  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log('location Service' + message);
    // this.messageService.add('HeroService: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
