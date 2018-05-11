import {Component, Input, OnInit} from '@angular/core';
import {delay} from 'q';
import {BannerAdCommunicatorService} from '../../../../services/banner-ad-communicator.service';
import {AdvertisementService} from '../../../../services/advertisement.service';
import {EventImageService} from '../../../../services/event-image.service';

@Component({
  selector: 'app-adbanner',
  templateUrl: './adbanner.component.html',
  styleUrls: ['./adbanner.component.css']
})
export class AdbannerComponent implements OnInit {

  constructor(private bannerAdCommunicatorService: BannerAdCommunicatorService) {

    bannerAdCommunicatorService.advertiserChanged$.subscribe(adCommunicator=>{

      if(adCommunicator.type !== this.type){
        return;
      }
      if(adCommunicator.imagesPath!=null && adCommunicator.imagesPath.length>0){
        this.banner = adCommunicator.imagesPath[0];
      }

      this.advertiserChanged = true;
      this.banners = adCommunicator.imagesPath;

      if(!this.delayLoopStarted){
        this.delayLoopStarted = true;
        this.rotateGalleryAdTopBanner(0).then();
      }
    });
  }

  private advertiserChanged=false;
  private delayLoopStarted = false;
  @Input()
  type:string;

  @Input()
  delayDuration:number;

  banners =[];
  banner={path:"",url:""};

  ngOnInit() {

   // this.rotateGalleryAdTopBanner(0).then();
  }
  private async rotateGalleryAdTopBanner(startIndex?:number){


    const readyFlag =  this.banners.length==0?false:true;

    if(!readyFlag){
      delay(3000).then(()=>{
        this.rotateGalleryAdTopBanner().then();
      });
      return;
    }

    if(startIndex==undefined || startIndex==null){
      startIndex = 0;
    }

    try{
      console.log("topBanners ",this.banners);
      for(let i=startIndex ; i< this.banners.length; i++){
        this.banner.path = this.banners[i].path;
        this.banner.url = this.banners[i].url;

        await delay(this.delayDuration);

        if(this.advertiserChanged){

           /**
            * rotate to next advertiser's Gallery Add
            * */

          this.advertiserChanged = false;
          this.rotateGalleryAdTopBanner(1).then();
          console.log("End of function from IF");
          return;
        }


      }
    }catch(e) {
      console.log(e);
    }
    console.log("End of function");
    this.rotateGalleryAdTopBanner(0).then();
  }


}
