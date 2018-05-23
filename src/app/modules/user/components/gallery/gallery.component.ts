import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AdvertisementService} from '../../../../services/advertisement.service';
import {environment} from '../../../../../environments/environment';
import {SectionResource} from '../../../../datamodel/section-resource';
import {FILE_TYPE} from '../../../../constant/file.type';
import {AdvertisementDetails} from '../../../../datamodel/advertisement.details';
import {delay} from 'q';
import {ActivatedRoute} from '@angular/router';
import {EventImageService} from '../../../../services/event-image.service';
import {EventImage} from '../../../../datamodel/event-image';
import {Event} from "../../../../datamodel/event";
import {BannerAdCommunicatorService} from '../../../../services/banner-ad-communicator.service';
import {RotationalBanner} from '../../../../datamodel/rotational-banner';
import {SectionResourceUtil} from '../../../../helper/section.resource.helper';
import {NavigationHelper} from '../../../../helper/navigation.helper';
import {NumberHelper} from '../../../../helper/number.helper';
import {SECTION_TYPE} from '../../../../constant/section.type';
import {AdCommunicator} from '../../../../datamodel/ad-communicator';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [AdvertisementService,EventImageService,BannerAdCommunicatorService]
})

export class GalleryComponent implements AfterViewInit,OnInit {
  currentImage:EventImage;
  nextBtn = true;
  prevBtn = true;
  shareSuffix = '/share';
  event: Event = new Event();

  forChildComponent={
    topBanner:[],
    bottomBanner:[]
  };
  preview={
      galleryId:0,
      popUpId:0
  };
  eventImagesFetchingComplete = false;
  roundWiseSectionResource ={TOP_BANNER:[[]],BOTTOM_BANNER:[[]]};
  eventImages: EventImage[] = [];
  currentAdvertisementDetails: AdvertisementDetails;
  advertisements:AdvertisementDetails[] = [];
  popAds:AdvertisementDetails[] = [];
  globalPopUpAdSection = [];
  advertisementConfig={
    gallery:{
      id:0,
      isEndOfAd:false,
      limit:1,
      selfLoop:true,
      apiOffset:0,
      delay:{
        global:10000,
        topBanner:5000,
        bottomBanner:5000,
      },
      banner:['top','bottom'],
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
      rotateSwitchedOff:false,
      currentIndex:0,
    }
  };
  identifier = "";
  popUpType='';
  resourcePath = environment.pictureUrl;
  eventImagePath = environment.eventPhotoUrl;
  eventImageSharingPath = environment.eventPhotoSharingUrl;
  advertisementOnPage = {
      popUpAd: {
      video:{ready:false,path:"",mimeType:""},
      images:[],
      currentImage:"",
      currentFileType:"",
      currentUrl:""
    },
    gallery:{
      logo:{path:"",url:""},
      background:{path:"",url:""},
      currentIndex:{},
    }

  };
  fileType: FILE_TYPE;
  roundWiserPopUpAds: SectionResource[][];
  roundWiserPopUpAdsSectionResource: SectionResource[];

  constructor(private rout: ActivatedRoute,
              private advertisementService: AdvertisementService,
              private eventImageService: EventImageService,
              private bannerAdCommunicatorService: BannerAdCommunicatorService) {


    this.currentAdvertisementDetails = new AdvertisementDetails();
    this.identifier =  this.rout.snapshot.paramMap.get('identifier');
    this.popUpType = this.rout.snapshot.paramMap.get('popUpType');
    const galleryIdStr = this.rout.snapshot.queryParamMap.get('galleryId');
    const popUpIdStr = this.rout.snapshot.queryParamMap.get('popUpId');
    this.currentImage = new EventImage();



    this.preview.galleryId = (galleryIdStr===null||galleryIdStr==='')?0:Number(galleryIdStr);
    this.preview.popUpId = (popUpIdStr===null||popUpIdStr==='')?0:Number(popUpIdStr);

  }


  ngOnInit(): void {
    if(this.identifier==null || this.identifier==''){
      this.advertisementConfig.popUpAd.showClosePopUp = true;
    }
    this.getEventBySlideShowIdentifier();
  }

  ngAfterViewInit() {
    (<any>$('.thumb')).height($('.thumb').width());

    (<any>$('#popUpModal')).modal({
      backdrop: 'static',
      keyboard: false
    });

    if(this.identifier!==null && this.identifier!==''){

      this.fetchGalleryAdvertisement();
      this.fetchPopUpAdvertisement();
      this.fetchEventImage();

    } else if(this.preview.popUpId>0){

      this.fetchPopUpAdvertisementById();
    } else if(this.preview.galleryId>0) {
      this.fetchGalleryAdvertisementById();
    }


  }

  getEventBySlideShowIdentifier() {
    this.eventImageService.getEventBySlideShowIdentifier(this.identifier).subscribe((event)=> {
      this.event = event;
    });
  }

  openImageModal(image) {
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

    if(index===0) {
      this.prevBtn = false;
    }
    if(index===totalImage-1) {
      this.nextBtn = false;
    }
  }
  public fetchEventImage(){
    this.eventImageService.getEventImagesBySlideShowIdentifier(this.identifier).subscribe((result)=>{
      this.eventImages = result;
      this.eventImagesFetchingComplete = true;
    });
  }
  public fetchGalleryAdvertisementById() {

    this.advertisementService.getById(this.preview.galleryId).subscribe((data)=>{
      this.advertisementConfig.gallery.isEndOfAd = true;
      this.advertisementConfig.gallery.selfLoop = true;
      this.advertisements.push(data);
    });

  }
  public fetchGalleryAdvertisement() {
        this.advertisementService.getAllBySentSlideShowIdentifierAndType(
                                      this.identifier,
                                      AdvertisementService.advTypeReqParamenter.GALLERY)
                              .subscribe((data)=>{ this.initGalleryAd(data); });

  }
  private initGalleryAd(data:AdvertisementDetails[]){
    if(data.length === 0){
      this.advertisementConfig.gallery.isEndOfAd = true;
      this.advertisementConfig.gallery.selfLoop = true;
    } else {
      this.advertisements = this.advertisements.concat(data);
    }
    this.roundWiseSectionResource.TOP_BANNER = SectionResourceUtil.getRoundWiseSectionResource(this.advertisements,SECTION_TYPE.TOP_BANNER);
    this.roundWiseSectionResource.BOTTOM_BANNER = SectionResourceUtil.getRoundWiseSectionResource(this.advertisements,SECTION_TYPE.BOTTOM_BANNER);

    this.setGalleryAdLogoAndBackground();
    /**
     * Top banner
     * */
    this.initBannerImagesRotation(<[SectionResource[]]>this.roundWiseSectionResource.TOP_BANNER,this.advertisementConfig.gallery.banner[0]);
    /**
     *  Bottom banner
     * */
    this.initBannerImagesRotation(<[SectionResource[]]>this.roundWiseSectionResource.BOTTOM_BANNER,this.advertisementConfig.gallery.banner[1]);

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

  public fetchPopUpAdvertisementById() {

    this.advertisementService.getById(this.preview.popUpId).subscribe((data)=>{
      this.advertisementConfig.popUpAd.isEndOfAd = true;
      this.popAds.push(data);
      this.preparePopUpAd();
      this.initPopupAd();

    });
  }
  public fetchPopUpAdvertisement() {
    if(this.advertisementConfig.popUpAd.isEndOfAd){
      this.initPopupAd();
      return;
    }

    let popUpTypeReqParam ='';
    switch(this.popUpType){
      case 'email':
        popUpTypeReqParam = AdvertisementService.advTypeReqParamenter.POPUP_EMAIL;
        break;
      case 'sms':
        popUpTypeReqParam = AdvertisementService.advTypeReqParamenter.POPUP_SMS;
    }
    this.advertisementService.getAllBySentSlideShowIdentifierAndType(this.identifier,
      popUpTypeReqParam).subscribe((data)=>{
      this.advertisementConfig.popUpAd.isEndOfAd = true;
      if(data.length===0){
        this.advertisementConfig.popUpAd.isEndOfAd = true;
      } else {
        this.popAds = this.popAds.concat(data);
        this.preparePopUpAd();
      }
      this.initPopupAd();

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
  private initPopupAd(){
    this.delayPopUpCloseIconShow();
    this.changesPopupAdRound().then();
  }
  private async changesPopupAdRound(){



    this.roundWiserPopUpAds = <[SectionResource[]]>SectionResourceUtil.getRoundWiseSectionResource(this.popAds,SECTION_TYPE.BANNER);
    console.log('roundWiserPopUpAds',this.roundWiserPopUpAds);
    for(const k in this.roundWiserPopUpAds){
      this.roundWiserPopUpAdsSectionResource = this.roundWiserPopUpAds[k];
      await this.rotatePopUpAd().then();
    }
    if(this.advertisementConfig.popUpAd.rotateSwitchedOff){
      return;
    }
    this.changesPopupAdRound().then();
  }
  private async rotatePopUpAd(){
    let sectionResources:SectionResource[] = this.roundWiserPopUpAdsSectionResource;
    for(let k=0;k<sectionResources.length;k++){

      if(this.advertisementConfig.popUpAd.rotateSwitchedOff){
        return;
      }


      if(sectionResources.length===0){
        return;
      }

      const fileType = sectionResources[k].fileType;


      if(fileType===FILE_TYPE.IMAGE){
        await this.preparePopUpAdImage(sectionResources[k]);
        //this.rotatePopUpImages().then();
      } else  if(fileType===FILE_TYPE.VIDEO){
        await this.preparePopUpAdVideo(sectionResources[k]);
      }

    }
  }
  public switchedOffRotation(){


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
      this.advertisementOnPage.popUpAd.currentImage =this.resourcePath+images[i].path;
      this.advertisementOnPage.popUpAd.currentUrl =images[i].url;
      await delay(this.advertisementConfig.popUpAd.image.delay);
    }
    this.fetchPopUpAdvertisement();
  }
  private async preparePopUpAdVideo(secRes: SectionResource){
    this.advertisementOnPage.popUpAd.currentFileType = FILE_TYPE.VIDEO;

    this.advertisementOnPage.popUpAd.video.path = this.resourcePath+secRes.fileName;
    this.advertisementOnPage.popUpAd.video.mimeType = secRes.mimeType;
    this.advertisementOnPage.popUpAd.video.ready = true;


    await delay(1000);

    /**
     * Duration can  be NaN if video does not load
     * For slow internet connection loop is present
     * */

    let duration =  (<any>document).getElementById('pmcGalAdVideo').duration;
    for(let i=0;isNaN(duration) && i<10;i++){
      await delay(500);
      duration =  (<any>document).getElementById('pmcGalAdVideo').duration;

    }
    console.log("Duration sd",duration);
    (<any>document).getElementById('pmcGalAdVideo').load();
    (<any>document).getElementById('pmcGalAdVideo').muted=true;
    (<any>document).getElementById('pmcGalAdVideo').play();
    await delay(duration*1000);
    console.log("Video Close ");
    (<any>document).getElementById('pmcGalAdVideo').pause();
    this.advertisementOnPage.popUpAd.video.ready = false;
  }
  private async preparePopUpAdImage(sectionResource: SectionResource){
    this.advertisementOnPage.popUpAd.currentFileType = FILE_TYPE.IMAGE;
    this.advertisementOnPage.popUpAd.images = [];
    let secResObj = {url:sectionResource.url,path:sectionResource.fileName};


    this.advertisementOnPage.popUpAd.currentImage =this.resourcePath+secResObj.path;
    this.advertisementOnPage.popUpAd.currentUrl =sectionResource.url;
    await delay(this.advertisementConfig.popUpAd.image.delay);
  }
  private resetPopUpAdSettings(){
    this.advertisementOnPage.popUpAd.video.ready = false;
  }

  private setGalleryAdLogoAndBackground(){


    const index  = NumberHelper.getRandomInt(0,this.advertisements.length-1);
    const galleryAds = this.advertisements[index];

    const logoSecRes = galleryAds.sections.LOGO.sectionResource;
    const bgSecRes = galleryAds.sections.BACKGROUND.sectionResource;


    /**
     * Single Logo
     * */
    if(logoSecRes.length>0){
      this.advertisementOnPage.gallery.logo.path = (logoSecRes[0].fileName!==null
        && logoSecRes[0].fileName.trim()!=='')
        ?this.resourcePath+logoSecRes[0].fileName:'';
      this.advertisementOnPage.gallery.logo.url = logoSecRes[0].url;

    }else{
      this.advertisementOnPage.gallery.logo.path = '';
      this.advertisementOnPage.gallery.logo.url = '';
    }
    /**
     * Single Background
     * */
    if(bgSecRes.length>0){
      this.advertisementOnPage.gallery.background.path = (bgSecRes[0].fileName!==null
        && bgSecRes[0].fileName.trim()!=='')
        ?this.resourcePath+bgSecRes[0].fileName:null;
      this.advertisementOnPage.gallery.background.url = bgSecRes[0].url;
    }else{
      this.advertisementOnPage.gallery.background.path = '';
      this.advertisementOnPage.gallery.background.url = '';
    }

  }

  private initBannerImagesRotation(advertiserWiseSectionResources: [SectionResource[]], type:string){

    this.forChildComponent.topBanner = [];
    let rotationalBanners: RotationalBanner[] = [];
    /**
     * Advertiser wise section resource
     * Each contains Section resources from each advertisers
     * */
    for(const a in advertiserWiseSectionResources){
      const secRes: SectionResource[] =  advertiserWiseSectionResources[a];
      let tmpTopBannerArray = [];

      /**
       * Section resources of each advertisers
      * */
      for(const i in secRes){
        const imageObj = {path:this.resourcePath+secRes[i].fileName,url:secRes[i].url};
        tmpTopBannerArray.push(imageObj);
      }

      const  rotationalBanner = new RotationalBanner();
      rotationalBanner.images = tmpTopBannerArray;
      rotationalBanners.push(rotationalBanner);
    }

    const adCommunicator = new AdCommunicator();
    adCommunicator.type = type;
    adCommunicator.rotationalBanners = rotationalBanners;

    this.bannerAdCommunicatorService.initRotation(adCommunicator);
  }
  public openAdUrl(url:string){
    NavigationHelper.openAdUrl(url);
  }

}
