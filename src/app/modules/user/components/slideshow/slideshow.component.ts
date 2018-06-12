import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
 import { WOW } from 'wowjs/dist/wow.min';
import {delay} from 'q';
import {Location} from '../../../../datamodel/location';
import {Event} from '../../../../datamodel/event';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {LocationService} from '../../../../services/location.service';
import {EventService} from '../../../../services/event.service';
import {LoginService} from '../../../../services/login.service';
import {AdvertisementService} from '../../../../services/advertisement.service';
import {AdvertisementDetails} from '../../../../datamodel/advertisement.details';
import {EventImageService} from '../../../../services/event-image.service';
import {City} from '../../../../datamodel/city';
import {State} from '../../../../datamodel/state';
import {LocationImage} from '../../../../datamodel/locationImage';
import {SectionResource} from '../../../../datamodel/section-resource';
import {SectionResourceUtil} from '../../../../helper/section.resource.helper';
import {NavigationHelper} from '../../../../helper/navigation.helper';
import {debug} from 'util';


@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css'],
  providers: [LocationService,EventService,AdvertisementService,LoginService,EventImageService]
})
export class SlideshowComponent implements  AfterViewInit,OnInit,DoCheck  {
  locationData:Location;
  eventData:Event;
  isSlideShowAdRotating = true;
  slideShowAdListIndex:number;
  slideShowAdData: AdvertisementDetails;
  slideShowAdList: AdvertisementDetails[]=[];
  pageConfig = {
    eventAndLocationFetched : false,
    slideShow:{duration:1}
  };

  defaultValue={
    breakTime:2,
    fadeInTransition:500,
    fadeOutTransition:500,
    durationSpeed:5000,
    bannerImageAdDelay:3000
  };
  locationId=0;
  eventId=0;
  slideShowAdId=0;
  resourcePath = environment.pictureUrl;
  eventImagePath = environment.eventPhotoUrl;
  pageData = {
    location:new Location(),
    event:new Event(),
    eventImage:[],
    currentBgImage:"",
    slideShowAd:{
      video:{
        link:"",
        mimeType:"",
        ready:false,
      },
      currentBannerImg:{path:"",url:""},
      currentBackground: "",
      currentFileType:"",
      closingCountdown:0,
      duration:0
    }
  };
  roundConfig = {index:{round:0,secRes:0}};
  eventConfig = {index:0};
  roundWiseSectionResource: SectionResource[][];
  constructor(private activatedRoute: ActivatedRoute,
              private locationService:LocationService,
              private eventService: EventService,
              private advertisementService:AdvertisementService,
              private eventImagesService: EventImageService) {

    const locIdStr = this.activatedRoute.snapshot.queryParamMap.get("locId");
    const eventIdStr = this.activatedRoute.snapshot.queryParamMap.get("eventId");
    const slideShowAdIdStr = this.activatedRoute.snapshot.queryParamMap.get("pmcadv");

    this.locationId =(locIdStr===null || locIdStr==='')?0:Number( locIdStr);
    this.eventId =(eventIdStr===null || eventIdStr==='')?0:Number( eventIdStr);
    this.slideShowAdId =(slideShowAdIdStr===null || slideShowAdIdStr==='')?0:Number( slideShowAdIdStr);


    this.locationData = null;
    this.eventData = null;
    this.slideShowAdListIndex = 0;

    this.pageData.location.city = new City();
    this.pageData.location.state = new State();
    this.pageData.location.locationBackgroundImages = [];
    this.pageData.currentBgImage = 'assets/images/bg.jpg';
    this.pageData.location.locationLogo = 'assets/images/dummy_transparent.png';
    this.pageData.event.eventPhoto  = 'assets/images/dummy_transparent.png';


    if(this.eventId>0){
      /**
       * Fetch and eventImage
       * and on subscribe bring event
       * and init js function
       * */
      this.getEventImages();
      this.fetchSlideShowAdByEventId();
    }else if(this.slideShowAdId>0){
      this.locationDefaultValue();
      this.eventDefaultValue();
      this.fetchSlideShowAdById();
    }else if(this.locationId>0){
      this.getLocationAndInitJs();
      this.eventDefaultValue();
    }
  }
  private locationDefaultValue(){

    this.pageData.location.locationLogo = 'assets/images/sample-location.png';
    this.pageData.location.name='Location Sample';
    this.pageData.location.address ='8825 E JEFFERSON AVE,DETROIT, MI 48214 ';
    this.pageData.location.city.name = "DETROIT";
    this.pageData.location.state.name = "MI";
    this.pageData.location.zip = "48214";
    this.pageData.location.phone = "(313) 822-660";
  }
  private eventDefaultValue(){
    this.pageData.event.eventPhoto = 'assets/images/sample-event.png';
  }


  ngDoCheck(): void {
  //  console.log(this.pageData.slideShowAd.video);
  }

  ngOnInit(){

  }
  ngAfterViewInit() {

  }
  public fetchSlideShowAdById(){
    this.advertisementService.getById(this.slideShowAdId).subscribe(result=>{

      this.slideShowAdList.push(result);
    },error => {},()=>{
      this.initJsFunction().then();
    });
  }
  public fetchSlideShowAdByEventId(){
    this.advertisementService.getBySentSlideShowByEventIdAndType(this.eventId,"slideshow")
      .subscribe(result=>{
        this.slideShowAdList = result;
      //  this.rotateVideo();
      },error=>{

      },()=>{

      });
  }

  public showSlideShow(){
    (<any>$("#eventImageDiv")).show();
    (<any>$("#slideShowAdDiv")).hide();
  }

  private getEventImages(){
    this.eventImagesService.getEventImagesByEventIdWhereIsSentSlideShowTrue(this.eventId).subscribe((result)=>{
      this.pageData.eventImage = result;

      this.getEventAndIntiJs();
    });
  }
  private async initClosingCountdown(){
    /**
     * Takes value first time only
     *  */
    if(this.slideShowAdList==null || this.slideShowAdList.length==0)return;

    const slideShowAdData = new AdvertisementDetails(this.slideShowAdList[0]);
    const  tbSection = slideShowAdData.sections.TOP_BANNER;

    this.pageData.slideShowAd.duration =  tbSection.duration;

    for(let i=this.pageData.slideShowAd.duration;i>=0;i--){
      this.pageData.slideShowAd.closingCountdown=i;
      await delay(1000);
      if(!this.isSlideShowAdRotating)break;
    }
    if( this.isSlideShowAdRotating ){
      this.stopSlideShowAdRotation();
    }

  }
  private async rotateVideo(sectionResource: SectionResource){
    if(!this.isSlideShowAdRotating)return false;
    this.pageData.slideShowAd.currentFileType="VIDEO";

    this.pageData.slideShowAd.video.link = "";
    this.pageData.slideShowAd.video.mimeType = "";
    this.pageData.slideShowAd.video.ready = false;

    const fileName = sectionResource.fileName;
    const fileType = sectionResource.fileType;
    const mimeType = sectionResource.mimeType;

    if(fileType === "VIDEO"){
      this.pageData.slideShowAd.video.link = this.resourcePath+fileName;
      this.pageData.slideShowAd.video.mimeType = mimeType;

      this.pageData.slideShowAd.video.ready = true;
      await delay(1000);
      /**
       * Duration can  be NaN if video does not load
       * For slow internet connection loop is present
       * */

      let duration =  (<any>document).getElementById('slidShowVideoAdPmc').duration;
      for(let i=0;isNaN(duration) && i<10;i++){
        await delay(500);
        duration =  (<any>document).getElementById('slidShowVideoAdPmc').duration;

      }

      console.log(sectionResource);
      (<any>document).getElementById('slidShowVideoAdPmc').muted = true;
     // (<any>document).getElementById('slidShowVideoAdPmc').load();
      (<any>document).getElementById('slidShowVideoAdPmc').play();

      await delay(duration*1000);
      try{
        const videoObj = (<any>document).getElementById('slidShowVideoAdPmc');
        if(videoObj!==undefined && videoObj!=null){
          videoObj.pause();
        }
      }catch(e){
        console.log(e);
      }

      this.pageData.slideShowAd.video.ready = false;
      await delay(500);
    }else{
      this.pageData.slideShowAd.video.ready = false;
      this.pageData.slideShowAd.currentFileType = "IMAGE";
    }
    return true;
  }
  private initSlideShowAd(){
    if(this.slideShowAdList.length===0)return;

    this.roundWiseSectionResource = SectionResourceUtil.getRoundWiseSectionResource(this.slideShowAdList,"TOP_BANNER");
    this.rotateSlideShowAd().then();
  }
  private async rotateSlideShowAd(){
    this.initClosingCountdown().then();
    (<any>$("#eventImageDiv")).fadeOut(500);
     await delay(500);
    (<any>$("#slideShowAdDiv")).show();

    this.startSlideShowAdRoundRotation().then();
  }
  private async rotateSlideShow(){

    if(this.eventConfig.index>=this.pageData.eventImage.length-1){
      this.eventConfig.index=0;
    }

    if(this.pageData.eventImage.length==0){return;}

    for(let i=this.eventConfig.index;i<this.pageData.eventImage.length;this.eventConfig.index=i,i++){

      if(this.isSlideShowAdRotating){
        $("#eventImageDiv").find(".dev-event-image").hide();
        return;
      }
      let index= Number(i);
      let fadeOutIndex=0;
      let fadeInIndex =0;
      if(index==0){
        fadeInIndex = index;
        fadeOutIndex = this.pageData.eventImage.length-1;
      }else{
        fadeInIndex = index;
        fadeOutIndex = index -1;
      }

      if( (<any>$('#'+fadeOutIndex+'slideShow')).is(":visible") ){
        (<any>$('#'+fadeOutIndex+'slideShow')).fadeOut(200,function(){
          $('#'+fadeInIndex+'slideShow').fadeIn(200);
        });
      }else{
        /**
         * Need this delay not sure why
         * Elements may be not ready first time
         * */
        await delay(500);
        // debugger;
        (<any>$('#'+fadeInIndex+'slideShow')).fadeIn(200,function(){
          $('#'+fadeOutIndex+'slideShow').fadeOut(200);
        });
      }
      this.eventConfig.index = 0;

      await delay(this.locationData.durationSpeed*1000);
    }
    this.rotateSlideShow().then();
  }
  private async rotateBackground(){
    const locBgImgs = this.pageData.location.locationBackgroundImages;
    if(locBgImgs==null || locBgImgs.length==0)return;


    /** In millisecond */
    let fadeInTransition = this.defaultValue.fadeInTransition;
    let fadeOutTransition = this.defaultValue.fadeOutTransition;
    let durationSpeed = this.defaultValue.durationSpeed;

    if(this.pageData.location.hasSlideshow){
       fadeInTransition = this.pageData.location.fadeInTime*1000;
       fadeOutTransition = this.pageData.location.fadeOutTime*1000;
       durationSpeed = this.pageData.location.durationSpeed*1000;
    }

    for(const i in locBgImgs){
      /*this.pageData.currentBgImage = this.pageData.currentBgImage =  this.resourcePath+locBgImgs[i].image;
      console.log(this.pageData.currentBgImage);*/

      let index= Number(i);
      let fadeOutIndex=0;
      let fadeInIndex =0;
      if(index==0){
        fadeInIndex = index;
        fadeOutIndex = locBgImgs.length-1;
      }else{
        fadeInIndex = index;
        fadeOutIndex = index -1;
      }

      if( (<any>$('#'+fadeOutIndex+'Bg')).is(":visible") ){
        (<any>$('#'+fadeOutIndex+'Bg')).fadeOut(fadeOutTransition,function(){
          $('#'+fadeInIndex+'Bg').fadeIn(fadeInTransition);
        });
      }else{
        /**
         * Need this delay not sure why
         * Elements may be not ready first time
         * */
        await delay(1000);
        (<any>$('#'+fadeInIndex+'Bg')).fadeIn(fadeInTransition);

      }


      await delay(durationSpeed);
    }
    this.rotateBackground().then();
  }
  private async rotateSlideShowImageBannerAd(sectionResource: SectionResource){
    if(!this.isSlideShowAdRotating)return false;
    this.pageData.slideShowAd.currentFileType="IMAGE";

    const fileName = sectionResource.fileName;
    const url = sectionResource.url;

    this.pageData.slideShowAd.currentBannerImg.path = this.resourcePath+fileName;
    this.pageData.slideShowAd.currentBannerImg.url = url;
    await delay(this.defaultValue.bannerImageAdDelay);
    return true;
  }

  private async startSlideShowAdRoundRotation(){

    if(!this.isSlideShowAdRotating)return false;

    if(this.roundWiseSectionResource.length==0)return;

    this.pageData.slideShowAd.currentFileType="VIDEO";


    /**
     * Check index
     * */
    if(this.roundConfig.index.round>=this.roundWiseSectionResource.length){
      this.roundConfig.index.round=0;
    }

    const tmpSectionResource = this.roundWiseSectionResource[this.roundConfig.index.round];

    if(this.roundConfig.index.secRes>=tmpSectionResource.length){
      this.roundConfig.index.secRes=0;
    }


    for (let k = this.roundConfig.index.round
      ; k < this.roundWiseSectionResource.length
      ;k++,this.roundConfig.index.round=k){

      const sectionResources: SectionResource[] = this.roundWiseSectionResource[k];

      for (let i= this.roundConfig.index.secRes
        ; i <  sectionResources.length
        ;i++, this.roundConfig.index.secRes = i){

        if(!this.isSlideShowAdRotating)return false;

        const sectionResource: SectionResource = sectionResources[i];
        const fileType = sectionResource.fileType;

        if(fileType === "IMAGE"){
          await this.rotateSlideShowImageBannerAd(sectionResource);
        }else if(fileType === "VIDEO"){
          await this.rotateVideo(sectionResource);
        }
        console.log();
      }
      this.roundConfig.index.secRes = 0;
    }
    this.roundConfig.index.round=0;
    this.startSlideShowAdRoundRotation().then();
  }
  public stopSlideShowAdRotation(){
    this.pageData.slideShowAd.video.ready = false;

    this.isSlideShowAdRotating = false;

    this.showSlideShow();
    this.rotateSlideShow().then();
    this.initStartAdRotationAfterDelay().then();

  }
  public getLocationAndInitJs(){
    this.locationService.getById(this.locationId).subscribe(result=>{
      if(result==null)return;
      this.locationData = result;
    },error=>{
    },()=>{
      this.initJsFunction().then();
    });
  }

  public getEventAndIntiJs(){
    this.eventService.getById(this.eventId).subscribe(data=>{

      if(data==null)return;
      this.eventData = data;
      this.locationData = this.eventData.location;
      this.pageConfig.eventAndLocationFetched = true;
    },error=>{

    },()=>{

      this.initJsFunction().then();
    });

  }
  private async initJsFunction(){

    (<any>$('.count')).each(function () {
      (<any>$(this)).prop('Counter',0).animate({
        Counter: $(this).text()
      }, {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now));
        }
      });
    });
    (<any>$(".img-check")).click(function(){
      (<any>$(this)).toggleClass("check");
    });
    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });
    (<any>$('#moar')).on("click", function() {
      var section = document.createElement('section');
      section.className = 'section--purple wow fadeInDown';
      this.parentNode.insertBefore(section, this);
    });



    if(this.eventData===null){
      this.eventDefaultValue();
    }else{
      this.pageData.event = this.eventData;
      this.pageData.event.eventPhoto = this.resourcePath+"/"+this.pageData.event.eventPhoto;
    }
    if(this.locationData===null) {
      this.locationDefaultValue();
    } else{

      this.pageData.location = this.locationData;

      this.pageData.location.locationLogo = this.resourcePath+this.pageData.location.locationLogo;
      this.rotateBackground().then();
    }

    new WOW({
      live: false
    }).init();
    await delay(8000);
    this.initSlideShowAd();
  }

  private async initStartAdRotationAfterDelay(){

    let breakTime;
    if(this.locationData ==null || this.locationData.breakTime==undefined || this.locationData.breakTime==0){
      breakTime = this.defaultValue.breakTime;
    }else{
      breakTime = this.locationData.breakTime;
    }
    await delay(breakTime*1000);
    this.isSlideShowAdRotating = true;
    this.rotateSlideShowAd().then();
  }
  public openAdUrl(url:string){
    NavigationHelper.openAdUrl(url);
  }
}
