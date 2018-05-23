import {Component, Input, OnInit} from '@angular/core';
import {delay} from 'q';
import {BannerAdCommunicatorService} from '../../../../services/banner-ad-communicator.service';
import {NavigationHelper} from '../../../../helper/navigation.helper';
import {RotationalBanner} from '../../../../datamodel/rotational-banner';

@Component({
  selector: 'app-adbanner',
  templateUrl: './adbanner.component.html',
  styleUrls: ['./adbanner.component.css']
})
export class AdBannerComponent implements OnInit {

  constructor(private bannerAdCommunicatorService: BannerAdCommunicatorService) {

    bannerAdCommunicatorService.onInitiationFromParent.subscribe(adCommunicator=>{
      if(adCommunicator.type !== this.type){
        return;
      }
      const  rotationalBanners: RotationalBanner[] = adCommunicator.rotationalBanners;
      console.log("rotationalBanners",rotationalBanners);
      this.initGalleryBannerRotation(rotationalBanners);
    });
  }

  @Input()
  type:string;

  @Input()
  delayDuration:number;

  banners =[];
  rotationalBanners:RotationalBanner[];
  banner={path:"",url:""};

  ngOnInit() {

   // this.rotateGalleryAdTopBanner(0).then();
  }
  private initGalleryBannerRotation(rotationalBanners:RotationalBanner[]){
    this.rotationalBanners = rotationalBanners;
    this.rotateGalleryAdBanner().then();
  }
  private async rotateGalleryAdBanner(){

    for(const k in this.rotationalBanners) {
      const banners:any[] = this.rotationalBanners[k].images;


      try {

        for (let i = 0; i < banners.length; i++) {
          this.banner.path = banners[i].path;
          this.banner.url = banners[i].url;

          await delay(this.delayDuration);

        }
      } catch (e) {
        console.log(e);
      }
    }
    this.rotateGalleryAdBanner().then();

  }

  public openAdUrl(url:string){
    NavigationHelper.openAdUrl(url);

  }

}
