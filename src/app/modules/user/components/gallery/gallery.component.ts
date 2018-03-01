import { Component, OnInit } from '@angular/core';
import {AdvertisementService} from '../../../../services/advertisement.service';
import {environment} from '../../../../../environments/environment';
import {SectionResource} from '../../../../datamodel/section-resource';
import {FILE_TYPE} from '../../../../constant/file.type';
import {AdvertisementDetails} from '../../../../datamodel/advertisement.details';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [AdvertisementService]
})
export class GalleryComponent implements OnInit {

  currentAdvertisementDetails: AdvertisementDetails;
  advertisements = [];
  popAds = [];
  globalPopUpAdSection = [];
  advertisementConfig={
    gallery:{
      isEndOfAd:false,
      limit:1,
      selfLoop:true,
      apiOffset:0,
      delay:10000,
      arrayOffset:0
    },
    popUpAd:{
      isEndOfAd:false,
      limit:1,
      selfLoop:true,
      apiOffset:0,
      arrayOffset:0,
      showCrossDelay:10000,
      video:{},
      image:{delay:500}
    }};
  eventId = 3;
  resourcePath = environment.pictureUrl;
  showClosePopUp = false;
  advertisementOnPage = {
    popUpAd: {
      video:{ready:false,path:"",mimeType:""},
      images:[],
      currentImage:"",
      currentFileType:"",
    },
    logo:"",
    topBanner:"",
    bottomBanner:"",
    background:""
  };
  fileType: FILE_TYPE;

  constructor(private advertisementService: AdvertisementService) {
    this.currentAdvertisementDetails = null;
  }

  ngOnInit() {
    console.log(this.advertisementOnPage);
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

    (<any>$('.thumb')).height($('.thumb').width());

    (<any>$('#myModal')).modal({  backdrop: 'static',
      keyboard: false});

    this.fetchGalleryAdvertisement();
    this.fetchPopUpAdvertisement();


    this.delay(this.advertisementConfig.popUpAd.showCrossDelay).then(()=>{
      this.showClosePopUp = true;
    });

  }

  fetchGalleryAdvertisement() {
    const offset = this.advertisementConfig.gallery.apiOffset++;
    const limit = this.advertisementConfig.gallery.limit;
    this.advertisementService.getByEventIdAndType(this.eventId,
                                                  AdvertisementService.advTypeReqParamenter.GALLERY
                                                  ,limit
                                                  ,offset).subscribe((data)=>{

                                                    if(data.length==0){
                                                      this.advertisementConfig.gallery.isEndOfAd = true;
                                                    } else {
                                                      this.advertisements = this.advertisements.concat(data);
                                                    }
                                                    this.rotationGalleryAd().then(()=>console.log("ROTATION CALLED"));
                                                });

  }
  fetchPopUpAdvertisement() {
    const offset = this.advertisementConfig.popUpAd.apiOffset++;
    const limit = this.advertisementConfig.popUpAd.limit;
    this.advertisementService.getByEventIdAndType(this.eventId,
      AdvertisementService.advTypeReqParamenter.POPUP_EMAIL
      ,limit
      ,offset).subscribe((data)=>{

      if(data.length==0){
        this.advertisementConfig.popUpAd.isEndOfAd = true;
      } else {
        this.popAds = this.popAds.concat(data);
        this.preparePopUpAd();
      }
      this.changePupUpAdd();
    });
  }
  private preparePopUpAd(){
    this.globalPopUpAdSection = [];
    for(let i = 0;i<this.popAds.length;i++) {
      const popupAds = new AdvertisementDetails(this.popAds[i]);
      this.globalPopUpAdSection.push(popupAds.sections.BANNER);
    }
  }
  async rotationGalleryAd() {
    const startIndex = this.getRotationStarIndex();
    for(let i = startIndex;i<this.advertisements.length;i++){

      this.currentAdvertisementDetails = new AdvertisementDetails( this.advertisements[i] );
      this.prepareAdvertisementForPage();


     await this.delay(this.advertisementConfig.gallery.delay);
    }
    if(!this.advertisementConfig.gallery.isEndOfAd){
      this.fetchGalleryAdvertisement();
      console.log("gallery API CALLED");
    } else if(this.advertisementConfig.gallery.selfLoop){
      console.log("gallery SELF LOOP");
      this.rotationGalleryAd().then();
    }
  }
  private getRotationStarIndex():number{
    let i = 0;
    if(!this.advertisementConfig.gallery.isEndOfAd){
      i =  this.advertisementConfig.gallery.arrayOffset*this.advertisementConfig.gallery.limit;
    }
    return i;
  }
  private getPopUpRotationStarIndex():number{
    console.log(this.globalPopUpAdSection);
    const offset = this.advertisementConfig.popUpAd.arrayOffset;
    const length = this.popAds.length;
    let i = 0;

    if(offset<length){
      i = offset;
    }else{
      this.advertisementConfig.popUpAd.arrayOffset =0;
    }

    this.advertisementConfig.popUpAd.arrayOffset++;
    return i;
  }
  private async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private prepareAdvertisementForPage(){

    const galleryAds = this.currentAdvertisementDetails;

    const logoSecRes = galleryAds.sections.LOGO.sectionResource;
    const bgSecRes = galleryAds.sections.BACKGROUND.sectionResource;
    const tbSecRes = galleryAds.sections.TOP_BANNER.sectionResource;
    const bbSecRes = galleryAds.sections.BOTTOM_BANNER.sectionResource;



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


  }
  private changePupUpAdd(){
    this.resetPopUpAdSettings();
    let i= this.getPopUpRotationStarIndex();
    console.log('Index '+i);

    if(this.globalPopUpAdSection[i]==undefined){
      this.delay(3000).then(()=>{
        this.changePupUpAdd();
        console.log('No advertisement found');
      });
      return;
    }

    let  secRes: SectionResource[] = [];
    if(this.globalPopUpAdSection[i].sectionResource.length>0){
      secRes = this.globalPopUpAdSection[i].sectionResource;
    }

    if(secRes.length>0){
      const fileType = secRes[0].fileType;


      if(fileType==FILE_TYPE.IMAGE){
        this.preparePopUpAdImage(secRes);
        this.rotatePopUpImages().then();
      } else  if(fileType==FILE_TYPE.VIDEO){
        this.preparePopUpAdVideo(secRes);
      }
    }

  }
  private async rotatePopUpImages(){
    const images = this.advertisementOnPage.popUpAd.images;
    for(const i in images){
      this.advertisementOnPage.popUpAd.currentImage =this.resourcePath+images[i];
      await this.delay(this.advertisementConfig.popUpAd.image.delay);
    }
    this.fetchPopUpAdvertisement();
  }
  private preparePopUpAdImage(secRes: SectionResource[]){
    this.advertisementOnPage.popUpAd.currentFileType = FILE_TYPE.IMAGE;
    this.advertisementOnPage.popUpAd.images = [];
    for(const index in secRes){
      this.advertisementOnPage.popUpAd.images.push(secRes[index].fileName);
    }
  }
  private preparePopUpAdVideo(secRes: SectionResource[]){
      this.advertisementOnPage.popUpAd.currentFileType = FILE_TYPE.VIDEO;

      this.advertisementOnPage.popUpAd.video.path = this.resourcePath+secRes[0].fileName;
      this.advertisementOnPage.popUpAd.video.mimeType = secRes[0].mimeType;
      this.advertisementOnPage.popUpAd.video.ready = true;

      this.delay(300).then(()=>{
         (<any>$("#pmcGalAdVideo")).load();
      });
  }
  private resetPopUpAdSettings(){
    this.advertisementOnPage.popUpAd.video.ready = false;
  }
}
