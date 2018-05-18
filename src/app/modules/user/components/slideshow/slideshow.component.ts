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
import {SectionResourceHelper} from '../../../../helper/section.resource.helper';


@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css'],
  providers: [LocationService,EventService,AdvertisementService,LoginService,EventImageService]
})
export class SlideshowComponent implements  AfterViewInit,OnInit,DoCheck  {
  locationData:Location;
  eventData:Event;
  slideShowAdRotation = true;
  slideShowAdListIndex:number;
  slideShowAdData: AdvertisementDetails;
  slideShowAdList: AdvertisementDetails[]=[];
  pageConfig = {
    eventAndLocationFetched : false,
    slideShow:{duration:1}
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
    console.log(locIdStr,eventIdStr);

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
      console.log("fetchSlideShowAdById ",result);
      this.slideShowAdList.push(result);
    },error => {},()=>{
      this.initJsFunction();
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
  public showSlideShowAd(){

    (<any>$("#eventImageDiv")).hide();
    (<any>$("#slideShowAdDiv")).show();

    this.pageData.slideShowAd.currentFileType="VIDEO";
    this.rotateVideo().then();
    this.initClosingCountdown().then();
  }
  public showSlideShow(){
    (<any>$("#eventImageDiv")).show();
    (<any>$("#slideShowAdDiv")).hide();
  }

  private getEventImages(){
    this.eventImagesService.getEventImagesByEventIdWhereIsSentSlideShowTrue(this.eventId).subscribe((result)=>{
      this.pageData.eventImage = result;
      console.log("Event Images",this.pageData.eventImage );
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
      if(!this.slideShowAdRotation)break;
    }
    if( this.slideShowAdRotation){
      this.stopSlideShowAdRotation();
    }

  }
  private async rotateVideo(){
   // debugger;
    if(!this.slideShowAdRotation){
      return;
    }
    this.pageData.slideShowAd.video.link = "";
    this.pageData.slideShowAd.video.mimeType = "";
    this.pageData.slideShowAd.video.ready = false;

    const currentIndex = this.getCurrentSlideShowIndex();
    const slideShowAdData = new AdvertisementDetails(this.slideShowAdList[currentIndex]);
    console.log("currentIndex ",currentIndex,slideShowAdData);

    const  tbSection = slideShowAdData.sections.TOP_BANNER;
    const  tbSecRes = tbSection.sectionResource;

    if(tbSecRes.length==0){
      delay(3000).then(()=>{
        this.rotateVideo().then();
      });
      return;
    }

    /**
     * Only one video
     * */
    let fileName = "";
    let fileType = "";
    let mimeType = "";




    if(tbSecRes.length>0) {
       fileName = tbSecRes[0].fileName;
       fileType = tbSecRes[0].fileType;
       mimeType = tbSecRes[0].mimeType;
    }

    if(fileType === "VIDEO"){
      this.pageData.slideShowAd.video.link = this.resourcePath+fileName;
      this.pageData.slideShowAd.video.mimeType = mimeType;





      await delay(300);
      this.pageData.slideShowAd.video.ready = true;
      (<any>$('#slidShowVideoAdPmc')).load();
      (<any>$('#slidShowVideoAdPmc')).show();

    }else{
      this.decrementCurrentSlideShowIndex();
      this.pageData.slideShowAd.video.ready = false;
      this.pageData.slideShowAd.currentFileType = "IMAGE";
      this.rotateSlideShowImageBannerAd().then();
    }
    console.log("currentIndex ",currentIndex,slideShowAdData);
  }
  private async rotateSlideShow(){

    for(const i in this.pageData.eventImage){


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
        await delay(1000);
        // debugger;
        (<any>$('#'+fadeInIndex+'slideShow')).fadeIn(200,function(){
          $('#'+fadeOutIndex+'slideShow').fadeOut(200);
        });
      }


      await delay(this.locationData.durationSpeed*1000);
    }
    this.rotateSlideShow().then();
  }
  private async rotateBackground(){
    const locBgImgs = this.pageData.location.locationBackgroundImages;
    if(locBgImgs==null || locBgImgs.length==0)return;


    /** In millisecond */
    let fadeInTransition = 500;
    let fadeOutTransition = 500;
    let durationSpeed = 5000;

    if(this.pageData.location.hasSlideshow){
       fadeInTransition = this.pageData.location.fadeInTime*1000;
       fadeOutTransition = this.pageData.location.fadeOutTime*1000;
       durationSpeed = this.pageData.location.durationSpeed*1000;
    }

    for(const i in locBgImgs){
      /*this.pageData.currentBgImage = this.pageData.currentBgImage =  this.resourcePath+locBgImgs[i].image;
      console.log(this.pageData.currentBgImage);*/
      console.log("BG ROTATE",i);
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
        console.log('#'+fadeInIndex+'Bg');
      }


      await delay(durationSpeed);
    }
    this.rotateBackground().then();
  }
  private async rotateSlideShowImageBannerAd(){
   // debugger;
    if(!this.slideShowAdRotation){
      return;
    }


    const currentIndex = this.getCurrentSlideShowIndex();
    const slideShowAdData = this.slideShowAdList[currentIndex];
    const  tbSection = slideShowAdData.sections.TOP_BANNER;
    let  tbSecRes = [];
    if(tbSection.rotation==='ROTATE'){
      tbSecRes = tbSection.sectionResource;
    }else  if(tbSection.rotation==='STATIC'){
      let secResObj = SectionResourceHelper.getSelectedStaticSectionResource(tbSection.sectionResource);
      tbSecRes.push(secResObj);

    }
    if(tbSecRes.length==0){
      delay(3000).then(()=>{
        this.rotateSlideShowImageBannerAd().then();
      });
      return;
    }
    /**
     * Multiple banner image
     * */
    let fileName = "";
    let fileType = "";
    let mimeType = "";
    let url = "";





   /* if(tbSection.rotation==='ROTATE'){
    }else if(tbSection.rotation==='STATIC'){
      tbSecRes.push(tbSection.sectionResource[0]);
    }*/

    for(const i in tbSecRes) {
      if(!this.slideShowAdRotation)return;
      fileName = tbSecRes[i].fileName;
      fileType = tbSecRes[i].fileType;
      mimeType = tbSecRes[i].mimeType;
      url = tbSecRes[i].url;

      if(fileType === "IMAGE"){

        this.pageData.slideShowAd.currentBannerImg.path = this.resourcePath+fileName;
        this.pageData.slideShowAd.currentBannerImg.url = url;
        await delay(2000);
      }else{
        this.decrementCurrentSlideShowIndex();
        this.pageData.slideShowAd.currentFileType = "VIDEO";
        this.rotateVideo().then();
        return;
      }
    }

    this.rotateSlideShowImageBannerAd().then();


   // console.log("Roation Ends");
  }
  private decrementCurrentSlideShowIndex():number{
    if(this.slideShowAdListIndex<=0){
      this.slideShowAdListIndex=this.slideShowAdList.length-1;
    }
    return this.slideShowAdListIndex--;
  }
  private getCurrentSlideShowIndex():number{
    if(this.slideShowAdListIndex>=this.slideShowAdList.length){
      this.slideShowAdListIndex=0;
    }
    return this.slideShowAdListIndex++;
  }
  public stopSlideShowAdRotation(){
    if((<any>document).getElementById('slidShowVideoAdPmc')!==undefined){
      (<any>document).getElementById('slidShowVideoAdPmc').pause();
    }
    $('#slidShowVideoAdPmc').hide();
    this.pageData.slideShowAd.video.ready = false;

    this.slideShowAdRotation = false;

    this.showSlideShow();
    this.initStartAdRotationAfterDelay().then();

  }
  public getLocationAndInitJs(){
    this.locationService.getById(this.locationId).subscribe(result=>{
      if(result==null)return;
      this.locationData = result;
    },error=>{
    },()=>{
      this.initJsFunction();
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

      this.initJsFunction();
    });

  }
  private initJsFunction(){

   // (<any>$('#eventImageParentDiv')).attr("data-wow-delay",this.pageConfig.slideShow.duration+'s');
    console.log("eventImageParentDiv",(<any>$('#eventImageParentDiv')).attr("data-wow-delay"));
    //return;
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

    const slideshowComponentReff = this;
    /*(<any>$("#slideShowAdDiv")).delay(10000).queue(function(next){

      setInterval(function(){

        }, 5000);

    });*/

   /* setInterval(()=>{

    },10000);*/






    if(this.eventData===null){
      this.eventDefaultValue();
    }else{
      this.pageData.event = this.eventData;
      this.pageData.event.eventPhoto = this.resourcePath+"/"+this.pageData.event.eventPhoto;
    }
    if(this.locationData===null) {
      this.locationDefaultValue();
    } else{
      console.log("this.locationData",this.locationData);
      this.pageData.location = this.locationData;
      console.log(" this.pageData.location", this.pageData.location);
      this.pageData.location.locationLogo = this.resourcePath+this.pageData.location.locationLogo;
      this.rotateBackground().then();
      delay(4000).then(value => {
        this.rotateSlideShow().then();
      });
    }

    new WOW({
      live: false
    }).init();
    delay(5000).then(()=>{
      this.showSlideShowAd();
    });
  }

  private async initStartAdRotationAfterDelay(){

    let breakTime;
    if(this.locationData ==null || this.locationData.breakTime==undefined || this.locationData.breakTime==0){
      breakTime = 5;
    }else{
      breakTime = this.locationData.breakTime;
    }
    await delay(breakTime*1000);
    this.slideShowAdRotation = true;
    this.showSlideShowAd();
  }
}
