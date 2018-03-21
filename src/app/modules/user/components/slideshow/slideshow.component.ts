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
    eventAndLocationFetched : false
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
    slideShowAd:{
      video:{
        link:"",
        mimeType:"",
        ready:false,
      },
      bannerImages:[],
      currentBannerImg:"",
      currentBackground: "",
      currentFileType:""
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

    this.pageData.location.locationLogo = 'assets/images/pmc-stock/vendor.png';
    this.pageData.location.name='Location Sample';
    this.pageData.location.address ='8825 E JEFFERSON AVE,DETROIT, MI 48214 (313) 822-660';

  }
  private eventDefaultValue(){
    this.pageData.event.eventPhoto = 'assets/images/pmc-stock/e1.png';
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
    const slideshowComponent = this;
    (<any>$("#changeBg")).fadeOut(500,function(){
      (<any>$("#adToggle")).fadeIn(500);
      slideshowComponent.pageData.slideShowAd.currentFileType="VIDEO";
      slideshowComponent.rotateVideo().then();
    });
  }
  public showSlideShow(){
    const slideshowComponent = this;
    (<any>$("#adToggle")).fadeOut(500,function(){
      (<any>$("#changeBg")).fadeIn(500);
      new WOW({
        live: false
      }).init();
    });
  }

  private getEventImages(){
    this.eventImagesService.getEventImagesByEventIdWhereIsSentSlideShowTrue(this.eventId).subscribe((result)=>{
      this.pageData.eventImage = result;
      console.log("Event Images",this.pageData.eventImage );
      this.getEventAndIntiJs();
    });
  }
  private async rotateVideo(){
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
    //debugger;
    if(fileType === "VIDEO"){
      this.pageData.slideShowAd.video.link = this.resourcePath+fileName;
      this.pageData.slideShowAd.video.mimeType = mimeType;


      delay(300).then(()=>{
        this.pageData.slideShowAd.video.ready = true;
        const slideshowComponent = this;

        (<any>$('#slidShowAdPmc')).load();

        (<any>$("#slidShowAdPmc")).off("ended").on("ended",function(){
          console.log("End video");
          this.pause();


          delay(2000).then(()=>{
            slideshowComponent.rotateVideo().then();
          });

       //   console.log("Init Rotate");

        });

      });

    }else{
      this.decrementCurrentSlideShowIndex();
      this.pageData.slideShowAd.video.ready = false;
      this.pageData.slideShowAd.currentFileType = "IMAGE";
      this.rotateSlideShowImageBanner().then();
    }
    console.log("currentIndex ",currentIndex,slideShowAdData);
  }
  private async rotateSlideShowImageBanner(){
    if(!this.slideShowAdRotation){
      return;
    }

    const currentIndex = this.getCurrentSlideShowIndex();
    console.log("currentIndex Of Banner ",currentIndex);
    const slideShowAdData = this.slideShowAdList[currentIndex];
    const  tbSection = slideShowAdData.sections.TOP_BANNER;
    const  tbSecRes = tbSection.sectionResource;

    if(tbSecRes.length==0){
      delay(3000).then(()=>{
        this.rotateSlideShowImageBanner().then();
      });
      return;
    }
    /**
     * Multiple banner image
     * */
    let fileName = "";
    let fileType = "";
    let mimeType = "";


    for(const i in tbSecRes) {
      fileName = tbSecRes[i].fileName;
      fileType = tbSecRes[i].fileType;
      mimeType = tbSecRes[i].mimeType;

      if(fileType == "IMAGE"){
         this.pageData.slideShowAd.currentBannerImg = this.resourcePath+fileName;
        await delay(2000);
      }else{
        this.decrementCurrentSlideShowIndex();
        this.pageData.slideShowAd.currentFileType = "VIDEO";
        this.rotateVideo().then();
        return;
      }
    }

    this.rotateSlideShowImageBanner().then();


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
  public stopSlideshowAdRotation(){
    this.slideShowAdRotation = false;

    this.showSlideShow();
  }
  public getLocationAndInitJs(){
    this.locationService.getById(this.locationId).subscribe(result=>{
      if(result==null)return;
      this.locationData = result;
    },error=>{
      console.log(error);
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
      console.log("Complete Ev",data);
    },error=>{

    },()=>{
      console.log("Complete Ev");

      this.initJsFunction();
    });

  }
  private initJsFunction(){


    console.log("Init JS Function");
    (<any>$('.count')).each(function () {
      $(this).prop('Counter',0).animate({
        Counter: $(this).text()
      }, {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now));
          console.log("Interval");
        }
      });
    });

    (<any>$('#changeBg')).easybg({
      images: [ // an array of background dimages
        'assets/images/bg2.jpg'
      ],
      interval: 2000,
      speed : 1000, // 1 minute
      ignoreError : false,
      changeMode : 'normal', // normal or random
      initIndex : 0,
      cloneClassId : null,
      cloneClassName : 'easybgClone',
      debug : false
    });

    (<any>$(".img-check")).click(function(){
      $(this).toggleClass("check");
    });

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });
    // (<any>$('[data-toggle="tooltip"]')).tooltip()

    (<any>$(document)).ready(function(){
      /*   let swiper = new Swiper('.swiper-container', {
           pagination: '.swiper-pagination',
           effect: 'coverflow',
           grabCursor: true,
           centeredSlides: true,
           slidesPerView: 'auto',
           coverflow: {
             rotate: 50,
             stretch: 0,
             depth: 100,
             modifier: 1,
             slideShadows : true
           }
         });*/

    });

    console.log("Before Init");
    new WOW({
      live: false
    }).init();
    /*let wow = new WOW()(
      {
        animateClass: 'animated',
        offset:       100,
        callback:     function(box) {
          console.log("WOW: animating <" + box.tagName.toLowerCase() + ">");
        }
      }
    );
   wow.init();*/


    console.log("After Init");

    (<any>$('#moar')).on("click", function() {
      var section = document.createElement('section');
      section.className = 'section--purple wow fadeInDown';
      this.parentNode.insertBefore(section, this);
    });

    const slideshowComponentReff = this;
    (<any>$("#adToggle")).delay(10000).queue(function(next){
      slideshowComponentReff.showSlideShowAd();
      next();
    });


    if(this.eventData===null){
      this.eventDefaultValue();
    }else{
      this.pageData.event = this.eventData;
      this.pageData.event.eventPhoto = this.resourcePath+"/"+this.pageData.event.eventPhoto;
    }
    if(this.locationData===null){
      this.locationDefaultValue();
    }else{
      this.pageData.location = this.locationData;
      this.pageData.location.locationLogo = this.resourcePath+this.pageData.location.locationLogo;
    }

  }

}
