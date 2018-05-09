import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AdCommunicator} from '../datamodel/ad-comunicator';

@Injectable()
export class BannerAdCommunicatorService {
  // Observable string sources
  private advertiserChangedSource = new Subject<AdCommunicator>();
  public advertiserChanged$ = this.advertiserChangedSource.asObservable();

  public changeAdvertiser(adCommunicator:AdCommunicator) {

    this.advertiserChangedSource.next(adCommunicator);
  }

}
