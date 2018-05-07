import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BannerAdCommunicatorService {
  // Observable string sources
  private advertiserChangedSource = new Subject<string>();
  public advertiserChanged$ = this.advertiserChangedSource.asObservable();

  public changeAdvertiser(type:string,imagePath: string) {

    this.advertiserChangedSource.next(type +'@'+imagePath);
  }

}
