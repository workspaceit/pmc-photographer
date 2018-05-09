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

    bannerAdCommunicatorService.advertiserChanged$.subscribe(command=>{
      const commandSegments = command.split('@');
      console.log("this.type "+this.type);
      if(commandSegments[0] === this.type){
        this.advertiserChanged = true;
       // this.banner = commandSegments[1];

      }

    });
  }

  private advertiserChanged=false;
  @Input()
  type:string;

  @Input()
  delayDuration:number;

  @Input()
  topBanners =[];
  @Input()
  galleryId=0;
  banner="";

  ngOnInit() {
    this.galleryId = 0;

    this.rotateGalleryAdTopBanner(0);
  }
  private async rotateGalleryAdTopBanner(startIndex?:number){

    const readyFlag =  this.topBanners.length==0?false:true;

    if(!readyFlag){
      delay(3000).then(()=>{
        this.rotateGalleryAdTopBanner().then();
      });
      return;
    }

    if(startIndex==undefined || startIndex==null){
      startIndex = 0;
    }
    const id = this.galleryId;
    try{
      console.log("topBanners ",this.topBanners);
      for( let i=startIndex ;i< this.topBanners.length;i++){
        this.banner = this.topBanners[i];
        console.log('From child component',this.type,i,this.banner,this.advertiserChanged);
        await delay(this.delayDuration);

        /*if(this.advertiserChanged){
          console.log('From child component',this.type,i,this.banner,this.advertiserChanged);

          /!**
           * rotate to next advertiser's Gallery Add
           * *!/
          this.advertiserChanged = false;
          this.rotateGalleryAdTopBanner(1).then();
          console.log("End of function from IF");
          return;
        }*/


      }
    }catch(e) {
      console.log(e);
    }
    console.log("End of function");
    this.rotateGalleryAdTopBanner(0).then();
  }


}
