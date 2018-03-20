import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AdvertisementService} from '../../../../services/advertisement.service';
import {environment} from '../../../../../environments/environment';
import {SectionResource} from '../../../../datamodel/section-resource';
import {FILE_TYPE} from '../../../../constant/file.type';
import {AdvertisementDetails} from '../../../../datamodel/advertisement.details';
import {delay} from 'q';
import {ActivatedRoute} from '@angular/router';
import {EventImageService} from '../../../../services/event-image.service';
import {EventImage} from '../../../../datamodel/event-image';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [AdvertisementService,EventImageService]
})

export class GalleryComponent implements AfterViewInit {
  currentImage:EventImage;
  nextBtn = true;
  prevBtn = true;


  forChildComponent={
    topBanner:[],
    bottomBanner:[]
  };
  eventImagesFetchingComplete = false;
  eventImages: EventImage[] = [];
  currentAdvertisementDetails: AdvertisementDetails;
  advertisements = [];
  popAds = [];
  globalPopUpAdSection = [];
  advertisementConfig={
    gallery:{
      id:0,
      isEndOfAd:false,
      limit:1,
      selfLoop:true,
      apiOffset:0,
      delay:{
        global:5000,
        topBanner:1000,
        bottomBanner:1000,
      },
      arrayOffset:0
    },
    popUpAd:{
      isEndOfAd:false,
      limit:1,
      selfLoop:true,
      apiOffset:0,
      arrayOffset:0,
      showCrossDelay:0,
      showClosePopUp:false,
      video:{},
      image:{delay:2000},
      rotateSwitchedOff:false
    }
  };
  identifier = "";
  popUpType='';
  resourcePath = environment.pictureUrl;
  eventImagePath = environment.eventPhotoUrl;
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



  constructor(private rout: ActivatedRoute,private advertisementService: AdvertisementService,private eventImageService: EventImageService) {
    this.currentAdvertisementDetails = new AdvertisementDetails();
    this.identifier =this.rout.snapshot.paramMap.get('identifier');
    this.popUpType = this.rout.snapshot.paramMap.get('popUpType');
    this.currentImage = new EventImage();

  }


ngAfterViewInit() {

 /*   (<any>$("#content-1")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 150 },
      theme:"rounded"
    });

    (<any>$("#content-2")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 150 },
      theme:"rounded"
    });*/


    (<any>$('.thumb')).height($('.thumb').width());

    (<any>$('#popUpModal')).modal({  backdrop: 'static',
      keyboard: false});


    this.fetchGalleryAdvertisement();
    this.fetchPopUpAdvertisement();
    this.fetchEventImage();
    this.rotateGalleryAdTopBanner(1).then();
    this.rotateGalleryAdBottomBanner(1).then();

  }

  openImageModal(image) {
    console.log("Image Modal Opened");
    this.currentImage = image;
    (<any>$('#image-gallery-image')).attr('src',this.eventImagePath+this.currentImage.image);
    (<any>$('#image-gallery')).modal('show');
    const currentImageIndex = this.eventImages.indexOf(this.currentImage);
    this.displayPrevNext(currentImageIndex);
  }

  displayPrevNext(index) {
    const totalImage = this.eventImages.length;
    this.nextBtn = true;
    this.prevBtn = true;

    if(index==0) {
      this.prevBtn = false;
    }
    if(index==totalImage-1) {
      this.nextBtn = false;
    }
  }
  public fetchEventImage(){
    this.eventImageService.getEventImagesBySlideShowIdentifier(this.identifier).subscribe((result)=>{
      this.eventImages = result;
      this.eventImagesFetchingComplete = true;
    });
  }
  public fetchGalleryAdvertisement() {
    if(this.advertisementConfig.gallery.isEndOfAd){
      this.rotationGalleryAd().then(()=>console.log("ROTATION CALLED"));
      return;
    }

    const offset = this.advertisementConfig.gallery.apiOffset++;
    const limit = this.advertisementConfig.gallery.limit;
    this.advertisementService.getBySentSlideShowIdentifierAndType(this.identifier,
                                                  AdvertisementService.advTypeReqParamenter.GALLERY
                                                  ,limit
                                                  ,offset).subscribe((data)=>{

                                                      if(data.length==0){
                                                        this.advertisementConfig.gallery.isEndOfAd = true;
                                                        this.advertisementConfig.gallery.selfLoop = true;
                                                      } else {
                                                        this.advertisements = this.advertisements.concat(data);
                                                      }
                                                      this.rotationGalleryAd().then(()=>console.log("ROTATION CALLED"));
                                                  });

  }
  showPreviousImage() {
    const currentImageIndex = this.eventImages.indexOf(this.currentImage);
    const previousImageIndex = currentImageIndex-1;
    if(previousImageIndex>=0) {
      this.currentImage = this.eventImages[previousImageIndex];
      this.displayPrevNext(previousImageIndex);
    }
  }
  showNextImage() {
    const currentImageIndex = this.eventImages.indexOf(this.currentImage);
    const nextImageIndex = currentImageIndex+1;
    const totalImage = this.eventImages.length;
    if(nextImageIndex<=totalImage-1) {
      this.currentImage = this.eventImages[nextImageIndex];
      this.displayPrevNext(nextImageIndex);
    }
    console.log("currentImageIndex "+this.currentImage.id);
    console.log("currentImageIndex "+this.currentImage.image);
  }
  reportImage() {
    const r = confirm("Do you really want to report this image?");
    if (r == true) {
      const imageId = this.currentImage.id;
      this.eventImageService.reportImage(imageId).subscribe((data)=> {
        console.log(data);
      });
    }
  }
  public fetchPopUpAdvertisement() {
    if(this.advertisementConfig.popUpAd.isEndOfAd){
      this.changePupUpAdd();
      return;
    }

    const offset = this.advertisementConfig.popUpAd.apiOffset++;
    const limit = this.advertisementConfig.popUpAd.limit;
    let popUpTypeReqParam ='';
    switch(this.popUpType){
      case 'email':
        popUpTypeReqParam = AdvertisementService.advTypeReqParamenter.POPUP_EMAIL;
        break;
      case 'sms':
        popUpTypeReqParam = AdvertisementService.advTypeReqParamenter.POPUP_SMS;
    }
    this.advertisementService.getBySentSlideShowIdentifierAndType(this.identifier,
      popUpTypeReqParam
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

  private delayPopUpCloseIconShow(){
    if(this.advertisementConfig.popUpAd.showCrossDelay==0){

      if(this.globalPopUpAdSection.length>0){
        this.advertisementConfig.popUpAd.showCrossDelay = this.globalPopUpAdSection[0].duration*1000;
      }

      delay(this.advertisementConfig.popUpAd.showCrossDelay).then(()=>{
        this.advertisementConfig.popUpAd.showClosePopUp = true;
      });
    }

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
      this.prepareGalleryAdForPage();


     await delay(this.advertisementConfig.gallery.delay.global);
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
    if(this.advertisementConfig.gallery.arrayOffset<this.advertisements.length){
      i =  this.advertisementConfig.gallery.arrayOffset++;
    }else{
      this.advertisementConfig.gallery.arrayOffset=0;
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

  private changePupUpAdd(){
    this.delayPopUpCloseIconShow();
    if(this.advertisementConfig.popUpAd.rotateSwitchedOff){
      console.log('Switched OFF');
      return;
    }

    this.resetPopUpAdSettings();
    let i= this.getPopUpRotationStarIndex();
    console.log('POPUP Index '+i);

    if(this.globalPopUpAdSection[i]==undefined){
      delay(3000).then(()=>{
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
  public switchedOffRotation(){
    console.log("rotateSwitchedOff");

    if(this.eventImagesFetchingComplete){
      this.advertisementConfig.popUpAd.rotateSwitchedOff = true;
    }

    if(this.eventImages.length>0){
      this.openImageModal(this.eventImages[0]);
    }else if(!this.eventImagesFetchingComplete){
      delay(2000).then(()=>this.switchedOffRotation());
    }


  }



  private async rotatePopUpImages(){
    const images = this.advertisementOnPage.popUpAd.images;
    for(const i in images){
      this.advertisementOnPage.popUpAd.currentImage =this.resourcePath+images[i];
      await delay(this.advertisementConfig.popUpAd.image.delay);
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

      delay(300).then(()=>{
        const galleryComponent = this;

        (<any>$("#pmcGalAdVideo")).load();
        (<any>$("#pmcGalAdVideo")).off("ended").on("ended",function(){
          debugger;
          this.pause();
          this.currentTime = 0;
          galleryComponent.fetchPopUpAdvertisement();

        });

      });
  }
  private prepareGalleryAdForPage(){

    const galleryAds = this.currentAdvertisementDetails;

    const logoSecRes = galleryAds.sections.LOGO.sectionResource;
    const bgSecRes = galleryAds.sections.BACKGROUND.sectionResource;
    const tbSecRes = galleryAds.sections.TOP_BANNER.sectionResource;
    const bbSecRes = galleryAds.sections.BOTTOM_BANNER.sectionResource;

    /**
     * Single Logo
     * */
    if(logoSecRes.length>0){
      this.advertisementOnPage.logo = this.resourcePath+logoSecRes[0].fileName;
    }
    /**
     * Single Background
     * */
    if(bgSecRes.length>0){
      this.advertisementOnPage.background = this.resourcePath+bgSecRes[0].fileName;
    }

    /**
     * Top banner
     * */
    if(tbSecRes.length>0){
       this.advertisementOnPage.topBanner = this.resourcePath+tbSecRes[0].fileName;
       this.forChildComponent.topBanner = [];
       for(const i in tbSecRes){
        this.forChildComponent.topBanner.push(this.resourcePath+tbSecRes[i].fileName);
       }
    }
    /**
     *  Bottom banner
     * */
    if(bbSecRes.length>0){
      this.advertisementOnPage.bottomBanner = this.resourcePath+bbSecRes[0].fileName;
      this.forChildComponent.bottomBanner = [];
      for(const i in tbSecRes){
        this.forChildComponent.bottomBanner.push(this.resourcePath+bbSecRes[i].fileName);
      }
    }


  }

  private resetPopUpAdSettings(){
    this.advertisementOnPage.popUpAd.video.ready = false;
  }
  private checkNullUndefiend(data):boolean{
    return (data==undefined || data==null)?false:true;
  }

  /**
   * Old code
   * Now it's a separated component
   * */
  private async rotateGalleryAdTopBanner(startIndex?:number){

    let readyFlag =  this.checkNullUndefiend(this.currentAdvertisementDetails);
    if(readyFlag){
      readyFlag = this.checkNullUndefiend(this.currentAdvertisementDetails.sections);
    }
    if(readyFlag){
      readyFlag = this.checkNullUndefiend(this.currentAdvertisementDetails.sections.TOP_BANNER);
    }
    if(readyFlag){
      readyFlag = this.checkNullUndefiend(this.currentAdvertisementDetails.sections.TOP_BANNER.sectionResource);
    }
    if(readyFlag){
      readyFlag = this.currentAdvertisementDetails.sections.TOP_BANNER.sectionResource.length>0?true:false;
    }
    if(!readyFlag){
      delay(this.advertisementConfig.gallery.delay.topBanner).then(()=>{
        this.rotateGalleryAdTopBanner().then();
      });
      return;
    }

    if(startIndex==undefined || startIndex==null){
      startIndex = 0;
    }
    const galleryAds = this.currentAdvertisementDetails;
    const tbSecRes = galleryAds.sections.TOP_BANNER.sectionResource;
    const id = galleryAds.id;
    try{
      for( let i=startIndex ;i< tbSecRes.length;i++){
        this.advertisementOnPage.topBanner = this.resourcePath+tbSecRes[i].fileName;
        await delay(this.advertisementConfig.gallery.delay.topBanner);
        if(id !== this.currentAdvertisementDetails.id){
          /**
           * rotate to next advertiser's Gallery Add
           * */
          this.rotateGalleryAdTopBanner(1).then();
          console.log("End of function from IF");
          return;
        }
      }
    }catch(e) {
      console.log(e);
    }
    console.log("End of function");
  }
  /**
   * Old code
   * Now it's a separated component
   * */
  private async rotateGalleryAdBottomBanner(startIndex?:number){

    let readyFlag =  this.checkNullUndefiend(this.currentAdvertisementDetails);
    if(readyFlag){
      readyFlag = this.checkNullUndefiend(this.currentAdvertisementDetails.sections);
    }
    if(readyFlag){
      readyFlag = this.checkNullUndefiend(this.currentAdvertisementDetails.sections.BOTTOM_BANNER);
    }
    if(readyFlag){
      readyFlag = this.checkNullUndefiend(this.currentAdvertisementDetails.sections.BOTTOM_BANNER.sectionResource);
    }
    if(readyFlag){
      readyFlag = this.currentAdvertisementDetails.sections.BOTTOM_BANNER.sectionResource.length>0?true:false;
    }

    if(!readyFlag){
      delay(this.advertisementConfig.gallery.delay.bottomBanner).then(()=>{
        this.rotateGalleryAdBottomBanner().then();
      });
      return;
    }

    if(startIndex==undefined || startIndex==null){
      startIndex=0;
    }

    let galleryAds = this.currentAdvertisementDetails;
    let bbSecRes = galleryAds.sections.BOTTOM_BANNER.sectionResource;
    let id = galleryAds.id;
    try{
      for( let i=startIndex;i<bbSecRes.length;i++){
        this.advertisementOnPage.bottomBanner = this.resourcePath+bbSecRes[i].fileName;
        await delay(this.advertisementConfig.gallery.delay.bottomBanner);
        if(id !== this.currentAdvertisementDetails.id){
          /**
           * rotate to next advertiser's Gallery Add
           * */
          this.rotateGalleryAdBottomBanner(1).then();
          return;
        }
      }
    }catch(e) {
      console.log(e);
    }
    this.rotateGalleryAdBottomBanner().then();

  }
}
