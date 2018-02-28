import { Component, OnInit } from '@angular/core';
import {AdvertisementService} from '../../../../services/advertisement.service';
import {Advertisement} from '../../../../datamodel/advertisement';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [AdvertisementService]
})
export class GalleryComponent implements OnInit {

  currentAdvertisement: Advertisement;
  advertisements = [];
  advertisementConfig={isEndOfAdvertisement:false,limit:1,selfLoop:true};
  eventId = 3;
  resourcePath = environment.pictureUrl;
  showClosePopUp = false;
  advertisementOnPage = {
    video:{path:"",mimeType:""},
    logo:"",
    topBanner:"",
    bottomBanner:"",
    background:""
  };

  constructor(private advertisementService: AdvertisementService) {
    this.currentAdvertisement = null;
  }

  ngOnInit() {
    (<any>$("#content-1")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 150 },
      theme:"rounded"
    });

    (<any>$("#content-2")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 150 },
      theme:"rounded"
    });

    $('.thumb').height($('.thumb').width());

    (<any>$('#myModal')).modal({  backdrop: 'static',
      keyboard: false});

    this.fetchAdvertisement(0);

    this.delay(5000).then(()=>{
      this.showClosePopUp = true;
    });

  }

  fetchAdvertisement(offset) {
    const limit = this.advertisementConfig.limit;
    this.advertisementService.getByEventId(this.eventId,limit,offset).subscribe((data)=>{

      if(data.length==0){
        this.advertisementConfig.isEndOfAdvertisement = true;
      } else {
        this.advertisements = this.advertisements.concat(data);
      }
      console.log(this.advertisements.length);
      this.rotation(offset).then(()=>console.log("ROTATION CALLED"));


    });
  }

  async rotation(offset) {
    const startIndex = this.getRotationStarIndex(offset);
    for(let i = startIndex;i<this.advertisements.length;i++){

      this.currentAdvertisement = new Advertisement( this.advertisements[i] );
      console.log("Starting");
      console.log(this.currentAdvertisement.GALLERY);
      console.log(this.currentAdvertisement.POPUP_SMS);
      console.log(this.currentAdvertisement.POPUP_EMAIL);
      console.log(this.currentAdvertisement.SLIDESHOW);
      console.log("WAITING");
      this.prepareAdvertisementForPage();


     await this.delay(5000);
    }
    if(!this.advertisementConfig.isEndOfAdvertisement){
      this.fetchAdvertisement(++offset);
      console.log("API CALLED");
    } else if(this.advertisementConfig.selfLoop){
      console.log("SELF LOOP");
      this.rotation(0).then();
    }
  }
  private getRotationStarIndex(offset):number{
    let i = 0;
    if(!this.advertisementConfig.isEndOfAdvertisement){
      i =  offset*this.advertisementConfig.limit;
    }
    return i;
  }
  private async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private prepareAdvertisementForPage(){
    const popUpAd = this.currentAdvertisement.POPUP_EMAIL;
    const galleryAds = this.currentAdvertisement.GALLERY;

    const logoSecRes = galleryAds.sections.LOGO.sectionResource;
    const bgSecRes = galleryAds.sections.BACKGROUND.sectionResource;
    const tbSecRes = galleryAds.sections.TOP_BANNER.sectionResource;
    const bbSecRes = galleryAds.sections.BOTTOM_BANNER.sectionResource;
    const popUpAdSecRes = popUpAd.sections.BANNER.sectionResource;

    for( const i in logoSecRes){
      this.advertisementOnPage.logo = this.resourcePath+logoSecRes[i].fileName;
    }

    for( const i in bgSecRes){
      this.advertisementOnPage.background = this.resourcePath+bgSecRes[i].fileName;
    }

    for( const i in tbSecRes){
      this.advertisementOnPage.topBanner = this.resourcePath+tbSecRes[i].fileName;
    }

    for( const i in bbSecRes){
      this.advertisementOnPage.bottomBanner = this.resourcePath+bbSecRes[i].fileName;
    }

    for( const i in popUpAdSecRes){
      if(popUpAdSecRes[i].fileType=="VIDEO"){
        this.advertisementOnPage.video.path = this.resourcePath+popUpAdSecRes[i].fileName;
        this.advertisementOnPage.video.mimeType = popUpAdSecRes[i].mimeType;
        (<any>$("#pmcGalAdVideo")).load();
      }
    }
  }
}
