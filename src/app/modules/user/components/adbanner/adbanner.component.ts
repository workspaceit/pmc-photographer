import {Component, Input, OnInit} from '@angular/core';
import {delay} from 'q';

@Component({
  selector: 'app-adbanner',
  templateUrl: './adbanner.component.html',
  styleUrls: ['./adbanner.component.css']
})
export class AdbannerComponent implements OnInit {

  constructor() { }

  @Input()
  delayDuration:number;

  @Input()
  topBanners =[];
  @Input()
  galleryId=0;
  topBanner="";

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
        this.topBanner = this.topBanners[i];
        await delay(this.delayDuration);

        if(id !== this.galleryId){
          /**
           * rotate to next advertiser's Gallery Add
           * */
          this.rotateGalleryAdTopBanner(0).then();
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
