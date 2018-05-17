import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EventImageService} from '../../../../services/event-image.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {EventImage} from '../../../../datamodel/event-image';
import {EventDetailsResponseData} from '../../../../response-data-model/event-details-response-data';
import {EventService} from '../../../../services/event.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {PhotographerLoginService} from "../../../../services/photographer-login.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.css'],
  providers: [EventImageService, EventService, PhotographerLoginService]
})
export class EventDashboardComponent implements OnInit, AfterViewInit {

  eventId: number;
  locationId: number;
  eventDetailsResponseData: EventDetailsResponseData = new EventDetailsResponseData();
  eventImages: EventImage[] = [];
  enableEdit = false;
  limit = 18;
  offset = 0;
  responseArrived = false;
  loadMore = true;
  imgPath = environment.eventPhotoUrl;
  API_URL = environment.apiUrl;
  BASE_URL = environment.apiBaseUrl;
  public config: DropzoneConfigInterface;
  checkedItems:number[]=[];
  selectedWatermarkId = 0;
  currentImage: EventImage = new EventImage();
  nextBtn = true;
  prevBtn = true;
  emailForm: FormGroup;
  smsForm: FormGroup;
  slideShowImagesOnly = false;
  sendFromPopup = false;
  items: number[] = [];
  eventImageSharingPath = environment.eventPhotoSharingUrl;
  shareSuffix = '/share';

  // checkboxes
  slideshowCheck = '';
  watermarkCheck = '';
  printCheck = '';

  constructor(private route: ActivatedRoute, private router: Router, private eventImageService: EventImageService,
              private eventService: EventService,private  photographerLoginService: PhotographerLoginService) { }

  ngOnInit() {
    console.log(this.currentImage);
    this.emailForm = new FormGroup({
      email:new FormControl('',[]),
      phoneNumber:new FormControl('',[]),
      username:new FormControl('',[Validators.required]),
      message:new FormControl('')
    });

    this.smsForm = new FormGroup({
      phoneNumber:new FormControl('',[Validators.required]),
      username:new FormControl('',[Validators.required]),
      message:new FormControl(''),
    });

    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.locationId = params['locationId'];
      this.offset = 0;
      this.slideShowImagesOnly = false;
      this.eventImages = [];
      this.getImages();
      this.getEventDetails();

      this.config = {
        url: this.API_URL+'/event-images/'+this.eventId,
        maxFiles: 50,
        clickable: true,
        acceptedFiles: 'image/*',
        createImageThumbnails: true,
        autoReset: 1,
        errorReset: 1,
        headers:{
          'Authorization': 'Bearer '+this.photographerLoginService.getLocalOauthCredential().access_token
        }
      };

    });
    this.initialize();
  }

  ngAfterViewInit() {
    const  thisComponent = this;
    setTimeout(function() {
      thisComponent.adjustHeight();
    }, 0);
  }

  adjustHeight() {
    setTimeout(function() {
      $('.thumb').height($('.thumb').width());
    }, 0);
  }

  uploadModal() {
    (<any>$('#uploadModal')).modal('show');
  }
  onUploadError(event) {
    console.log(event);
  }
  onUploadSuccess(event) {
    this.eventImages.unshift(event[1]);
    this.offset+=1;
    this.adjustHeight();
  }
  onUploadComplete(event,dz) {
    if(this.slideShowImagesOnly) {
      this.initializeValues();
      this.slideShowImagesOnly = false;
      this.getImages();
    }
    (<any>$('#uploadModal')).modal('hide');
  }
  getEventDetails() {
    this.eventService.getEventDetails(this.eventId).subscribe((data) => {
      this.eventDetailsResponseData = data;
    });
  }

  getImages() {
    if (this.slideShowImagesOnly) {
      this.getEventImagesFromSlideshow();
    } else {
      this.getEventImages();
    }
  }

  getEventImages() {
    this.eventImageService.getEventImages(this.eventId, this.limit, this.offset).subscribe((data) => {
      if(data.length === 0) {
        this.loadMore = false;
      } else {
        this.eventImages = this.eventImages.concat(data);
        this.adjustHeight();
      }
    });
  }

  getEventImagesFromSlideshow() {
    this.eventImageService.getEventImagesFromSlideshow(this.eventId, this.limit, this.offset).subscribe((data) => {
      if(data.length === 0) {
        this.loadMore = false;
      } else {
        this.eventImages = this.eventImages.concat(data);
        this.adjustHeight();
      }
    });
  }

  enableEditPhotos() {
    this.enableEdit = !this.enableEdit;
    if(!this.enableEdit) {
      this.resetSelected();
    }
  }
  resetSelected() {
    this.checkedItems = [];
  }

  checkBoxUpdate(eventImage,$event) {
    if($event.target.checked) {
      const index = this.checkedItems.indexOf(eventImage.id);
      if(index<0) {
        this.checkedItems=this.checkedItems.concat(eventImage.id);
      }
    } else {
      const index = this.checkedItems.indexOf(eventImage.id);
      if (index !== -1) {
        this.checkedItems.splice(index, 1);
      }
    }
    console.log(this.checkedItems);
  }

  deletePhotos() {
    if(this.checkedItems.length === 0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
       this.eventImageService.deleteEventImages(this.checkedItems).subscribe((data) => {
         if(data) {
            this.removePhotosFromView();
            this.resetSelected();
           (<any>$).growl.notice({ message: 'Image removed!' });
         }
       },(err)=> {
          console.log(err.error);
         (<any>$).growl.error({ message: err.error });
         }
       );
    }
  }

  removePhotosFromView() {
    for(const item of this.checkedItems) {
      this.eventImages = this.eventImages.filter(data=>data.id !== item);
    }
  }

  sendToSlideShowMultipleImages() {
    this.sendFromPopup = false;
    this.sendToSlideShow();
  }

  removeFromSlideShowMultipleImages() {
    this.sendFromPopup = false;
    this.removeFromSlideshow();
  }

  sendViaEmailMultipleImages() {
    let cItems = this.getCheckedItems();
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      this.sendFromPopup = false;
      (<any>$('#sendPhotoViaEmail')).modal('show');
    }
  }

  sendSingleImage(imageId) {
    this.sendFromPopup = true;
    this.items = [];
    this.items += imageId;
    (<any>$('#sendPhotoViaEmail')).modal('show');
  }

  addWatermarkSingleImage(imageId) {
    this.sendFromPopup = true;
    this.items = [];
    this.items += imageId;
    this.addWatermark();
  }

  removeWatermarkSingleImage(imageId) {
    this.sendFromPopup = true;
    this.items = [];
    this.items += imageId;
    this.removeWatermark();
  }

  sendToSlideshowSingleImage(imageId) {
    this.sendFromPopup = true;
    this.items = [];
    this.items += imageId;
    this.sendToSlideShow();
  }

  removeFromSlideshowSingleImage(imageId) {
    this.sendFromPopup = true;
    this.items = [];
    this.items += imageId;
    this.removeFromSlideshow();
  }

  send(value) {
    let email = '';
    let phoneNumber = '';
    const username = value.username;
    if(value.email) {
      email = value.email;
    }
    if(value.phoneNumber) {
      phoneNumber = value.phoneNumber;
    }
    const message = value.message;
    let cItems = [];
    if(this.sendFromPopup){
      cItems = this.items;
    }
    else {
      cItems = this.checkedItems;
    }
    console.log(cItems);
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    }
    else {
      this.eventImageService.send(cItems, username, email, phoneNumber, message,this.eventId).subscribe((data) => {
          if(data) {
            for(const item of cItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.resetSelected();
            (<any>$('#sendPhotoViaEmail')).modal('hide');
            (<any>$).growl.notice({ message: 'Sent successfully!' });
            this.emailForm.reset();
          }
        },(err)=> {
          console.log(err.error);
          (<any>$).growl.error({ message: err.error });
        }
      );
    }


    // Watermark check
    if(this.watermarkCheck === 'add') {
      this.addWatermark();
    }
    else if(this.watermarkCheck === 'remove'){
      this.removeWatermark();
    }

    // Slideshow check
    if(this.slideshowCheck === 'send'){
      this.sendToSlideShow();
    }
    else if(this.slideshowCheck ==='remove') {
      this.removeFromSlideshow();
    }

    // print check
    if(this.printCheck === 'print') {
      this.print();
    }

  }

  openImageModal(image) {
    if(this.enableEdit){
      return;
    }
    console.log("Image Modal Opened");
    this.currentImage = image;
    (<any>$('#image-gallery-image')).attr('src',this.imgPath + image.image);
    (<any>$('#image-gallery')).modal('show');
    const currentImageIndex = this.eventImages.indexOf(this.currentImage);
    this.displayPrevNext(currentImageIndex);
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

  showPreviousImage() {
    const currentImageIndex = this.eventImages.indexOf(this.currentImage);
    const previousImageIndex = currentImageIndex-1;
    if(previousImageIndex>=0) {
      this.currentImage = this.eventImages[previousImageIndex];
      this.displayPrevNext(previousImageIndex);
    }
  }

  displayPrevNext(index) {
    const totalImage = this.eventImages.length;
    this.nextBtn = true;
    this.prevBtn = true;
    if(index === 0) {
      this.prevBtn = false;
    }
    if(index === totalImage-1) {
      this.nextBtn = false;
    }
  }

  print() {
    let cItems = this.getCheckedItems();
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      let images: EventImage[] = [];
      console.log(this.eventImages);
      for (const item of cItems) {
        images = images.concat(this.eventImages.filter(data => data.id === item));
      }
      console.log(images);
      let html = '';
      for (const image of images) {
        html += "<img src='" + this.imgPath + image.image + "'/>";
      }
      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
            //........Customized style.......
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents + html}</body>
        </html>`
      );
      popupWin.document.close();
    }
    for(const item of cItems) {
      $('#checkboxFiveInput'+item).prop('checked',false);
    }
    this.resetSelected();
  }

  initialize() {
    const  thisComponent = this;
    (<any>$("#content-2")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 200 },
      theme:"rounded",
      callbacks:{
        onTotalScrollOffset: 200,
        whileScrolling: function() {
          // console.log(this.mcs.topPct);
          if(this.mcs.topPct > 90) {
            // console.log("scrolling done . . .");
              if(thisComponent.loadMore) {
                thisComponent.offset += thisComponent.limit;
                thisComponent.getImages();
              }
          }
        },
      }
    });

    $(".img-check").click(function() {
      $(this).toggleClass("check");
    });

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });

    (<any>$('[data-toggle="tooltip"]')).tooltip();
    $('.thumb').height($('.thumb').width());
  }

  // This function disables buttons when needed
  disableButtons(counter_max, counter_current) {
    $('#show-previous-image, #show-next-image').show();
    if (counter_max === counter_current) {
      $('#show-next-image').hide();
    } else if (counter_current === 1) {
      $('#show-previous-image').hide();
    }
  }

  getCheckedItems(){
    let cItems = [];
    if(this.sendFromPopup){
      cItems = this.items;
    }
    else {
      cItems = this.checkedItems;
    }
    console.log(cItems);
    return cItems;
  }

  addWatermarkMultipleImages(){
    this.sendFromPopup = false;
    this.addWatermark();
  }

  removeWatermarkMultipleImages(){
    this.sendFromPopup = false;
    this.removeWatermark();
  }

  addWatermark() {
    let cItems = this.getCheckedItems();
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No photo selected' });
    } else if(this.eventDetailsResponseData.event.watermarks.length === 0) {
      (<any>$).growl.warning({ message: 'No watermark assigned for this event' });
    } else {
      this.eventImageService.addWatermark(cItems, this.eventDetailsResponseData.event.watermarks[0].id).subscribe((data) => {
        if (data) {
          for(let j = 0; j < data.length; j++) {
            for (let i = 0; i < this.eventImages.length; i++) {
              if (this.eventImages[i].id === data[j].id) {
                this.eventImages[i] = data[j];
                if(this.sendFromPopup){
                  this.currentImage = this.eventImages[i];
                  (<any>$('#image-gallery-image')).attr('src',this.imgPath + this.currentImage.image);
                }
                break;
              }
            }
          }
          (<any>$).growl.notice({title: 'Success!', message: 'Watermark added'});
          this.adjustHeight();
          setTimeout(function() {
            for(let i = 0; i < data.length; i++) {
              const  f = $('#checkboxFiveInput' + data[i].id).prop('checked', true);
            }
          }, 0);
        }
      }, (err) => {
        console.log(err.error);
        (<any>$).growl.error({message: err.error});
      });
    }
  }

  removeWatermark() {
    let cItems = this.getCheckedItems();
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No photo selected' });
    } else {
      this.eventImageService.removeWatermark(cItems).subscribe((data) => {
          if (data) {
            for(let j = 0; j < data.length; j++) {
              for (let i = 0; i < this.eventImages.length; i++) {
                if (this.eventImages[i].id === data[j].id) {
                  this.eventImages[i] = data[j];
                  if(this.sendFromPopup) {
                    this.currentImage = this.eventImages[i];
                    (<any>$('#image-gallery-image')).attr('src', this.imgPath + this.currentImage.image);
                  }
                  break;
                }
              }
            }
            (<any>$).growl.notice({title: 'Success!', message: 'Watermark removed'});
            this.adjustHeight();
            setTimeout(function() {
              for(let i = 0; i < data.length; i++) {
                $('#checkboxFiveInput' + data[i].id).prop('checked', true);
              }
            }, 0);
          }
        }, (err) => {
          console.log(err.error);
          (<any>$).growl.error({message: err.error});
        }
      );
    }
  }

  sendToSlideShow() {
    let cItems = this.getCheckedItems();
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      this.eventImageService.sendToSlideShow(cItems).subscribe((data) => {
          if(data) {
            for(let j = 0; j < data.length; j++) {
              for (let i = 0; i < this.eventImages.length; i++) {
                if (this.eventImages[i].id === data[j].id) {
                  this.eventImages[i] = data[j];
                  this.currentImage = this.eventImages[i];
                  break;
                }
              }
            }
            for(const item of cItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.resetSelected();
            this.adjustHeight();
            (<any>$).growl.notice({ message: 'Successfully send to slideshow!' });
          }
        },(err)=> {
          console.log(err.error);
          (<any>$).growl.error({ message: err.error });
        }
      );
    }
  }

  removeFromSlideshow() {
    let cItems = this.getCheckedItems();
    if(cItems.length === 0) {
      (<any>$).growl.warning({ message: 'No photo selected' });
    } else {
      this.eventImageService.removeFromSlideShow(cItems).subscribe((data) => {
          if(data) {
            for(let j = 0; j < data.length; j++) {
              for (let i = 0; i < this.eventImages.length; i++) {
                if (this.eventImages[i].id === data[j].id) {
                  this.eventImages[i] = data[j];
                  this.currentImage = this.eventImages[i];
                  break;
                }
              }
            }
            for(const item of cItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.removePhotosFromView();
            this.resetSelected();
            this.adjustHeight();
            (<any>$).growl.notice({ message: 'Successfully removed from Slideshow!' });
          }
        },(err)=> {
          console.log(err.error);
          (<any>$).growl.error({ message: err.error });
        }
      );
    }
  }

  slideShowToggle() {
    this.initializeValues();
    this.getImages();
  }

  initializeValues() {
    this.offset = 0;
    this.eventImages = [];
    this.enableEdit = false;
  }

}
