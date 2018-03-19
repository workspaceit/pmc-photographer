import {AfterViewInit, Component, OnInit} from '@angular/core';
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
export class SlideshowComponent implements  AfterViewInit,OnInit  {
  locationData:Location;
  eventData:Event;
  slideShowAdData: AdvertisementDetails;
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
         mimeType:""
      },
      bannerImages:[],
      currentBackground: "",
    }
  };
  constructor(private activatedRoute: ActivatedRoute,
              private locationService:LocationService,
              private eventService: EventService,
              private advertisermentService:AdvertisementService,
              private eventImagesService: EventImageService) {
    const locIdStr = this.activatedRoute.snapshot.queryParamMap.get("locId");
    const eventIdStr = this.activatedRoute.snapshot.queryParamMap.get("evtId");
    const slideShowAdIdStr = this.activatedRoute.snapshot.queryParamMap.get("pmcadv");

    this.locationId =(locIdStr===null || locIdStr==='')?0:Number( locIdStr);
    this.eventId =(eventIdStr===null || eventIdStr==='')?0:Number( eventIdStr);
    this.slideShowAdId =(slideShowAdIdStr===null || slideShowAdIdStr==='')?0:Number( slideShowAdIdStr);


    this.locationData = null;
    this.eventData = null;

    console.log(locIdStr,eventIdStr);
    this.getEventImages();
  }
  private locationDefaultValue(){

    this.pageData.location.locationLogo = 'assets/images/pmc-stock/vendor.png';
    this.pageData.location.name='Location Sample';
    this.pageData.location.address ='8825 E JEFFERSON AVE,DETROIT, MI 48214 (313) 822-660';

  }
  private eventDefultValue(){
    this.pageData.event.eventPhoto = 'assets/images/pmc-stock/e1.png';
  }
  ngOnInit(){

  }
  ngAfterViewInit() {
    this.getLocationAndEvent();
    this.advertisermentService.getById(this.slideShowAdId)
      .subscribe(result=>{
        this.slideShowAdData = result;

        const  tbSection = this.slideShowAdData.sections.TOP_BANNER;
        const  videoSection = this.slideShowAdData.sections.BOTTOM_BANNER;
        let  tbSecRes = tbSection.sectionResource;
        tbSecRes = tbSecRes.concat(videoSection.sectionResource);
        for(const i in tbSecRes) {
          const fileName = tbSecRes[i].fileName;
          const fileType = tbSecRes[i].fileType;
          const mimeType = tbSecRes[i].mimeType;

          if(fileType === "VIDEO"){
            this.pageData.slideShowAd.video.link = this.resourcePath+"/"+fileName;
            this.pageData.slideShowAd.video.mimeType = mimeType;
            (<any>$('#slidShowAdPmc')).load();
          } else {
            this.pageData.slideShowAd.bannerImages.push(this.resourcePath+"/"+fileName);
          }

        }
        console.log("PAGEDATA",this.pageData);
      },error=>{

      },()=>{

      });
    this.rotateBackground().then();
  }
  private getEventImages(){
    this.eventImagesService.getEventImagesByEventIdWhereIsSentSlideShowTrue(this.eventId).subscribe((result)=>{
      this.pageData.eventImage = result;
      console.log("Event Images",this.pageData.eventImage );
      this.getEventAndIntiJs();
    });
  }
  private async rotateBackground(){
    console.log("Roation STart");
    const  bannerImages = this.pageData.slideShowAd.bannerImages;
    for(const i in bannerImages){
      this.pageData.slideShowAd.currentBackground = bannerImages[i];
      await delay(3000);
    }
    if(bannerImages.length==0){
      delay(3000).then(()=>{
        this.rotateBackground().then();
      });
    }else {
      this.rotateBackground().then();
    }
    console.log("Roation Ends");
  }
  public getLocationAndEvent(){
    if(this.locationId >0){
      this.locationService.getById(this.locationId).subscribe(result=>{
        if(result==null)return;
        this.locationData = result;
      },error=>{
        console.log(error);
      },()=>{
        if(this.eventId >0) {
          console.log("Complete loc");
         // this.getEventAndIntiJs();
        }else{
          this.initJsFunction();
        }

      });
    } else  if(this.eventId >0) {
     // this.getEventAndIntiJs();
    }else {
     // this.initJsFunction();
    }
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
        }
      });
    });

    /*(<any>$('#changeBg')).easybg({
      images: [ // an array of background dimages
        'assets/images/bg2.jpg'
      ],
      interval: 10000,
      speed : 1000, // 1 minute
      ignoreError : false,
      changeMode : 'normal', // normal or random
      initIndex : 0,
      cloneClassId : null,
      cloneClassName : 'easybgClone',
      debug : false
    });*/

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

    // Hide the div
    //(<any>$("#adToggle")).hide();
    // $('#video1').get(0).pause();

    // Show the div in 5s
    //(<any>$("#adToggle")).delay(20000).fadeIn(500);


    //(<any>$("#adToggle")).delay(20000).fadeOut(500);

    let ONLYONETIME_EXECUTE = null;
    window.addEventListener('load', function(){ // on page load

      document.body.addEventListener('touchstart', function(e){

        if (ONLYONETIME_EXECUTE == null) {

          //video.play();

          //if you want to prepare more than one video/audios use this trick :
          //  video2.play();
          //  video2.pause();
          // now video2 is buffering and you can play it programmability later

          ONLYONETIME_EXECUTE = 0;
        }

      }, false);

    }, false);


    if(this.eventData===null){
      this.eventDefultValue();
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
