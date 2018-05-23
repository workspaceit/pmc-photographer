import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AdCommunicator} from '../datamodel/ad-communicator';

@Injectable()
export class BannerAdCommunicatorService {
  // Observable string sources
  private advertiserChangedSource = new Subject<AdCommunicator>();
  public onInitiationFromParent = this.advertiserChangedSource.asObservable();

  public initRotation(rotationalBanners:AdCommunicator) {
    this.advertiserChangedSource.next(rotationalBanners);
  }

}
