import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EventImageService} from '../../../../services/event-image.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {EventImage} from '../../../../datamodel/event-image';
import {EventDetailsResponseData} from '../../../../response-data-model/event-details-response-data';
import {EventService} from '../../../../services/event.service';
import {LoginService} from '../../../../services/login.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.css'],
  providers: [EventImageService, EventService, LoginService]
})
export class EventDashboardComponent implements OnInit, AfterViewInit {

  eventId: number;
  eventDetailsResponseData: EventDetailsResponseData = new EventDetailsResponseData();
  eventImages: EventImage[] = [];
  enableEdit = false;
  limit = 18;
  offset = 0;
  responseArrived = false;
  loadMore = true;
  imgPath = environment.eventPhotoUrl;
  API_URL = environment.apiUrl;
  public config: DropzoneConfigInterface;
  checkedItems:number[]=[];
  selectedWatermarkId = 0;
  currentImage: EventImage = new EventImage();
  nextBtn = true;
  prevBtn = true;
  emailForm: FormGroup;
  smsForm: FormGroup;
  slideShowImagesOnly = false;

  constructor(private route: ActivatedRoute, private router: Router, private eventImageService: EventImageService,
              private eventService: EventService,private  loginService: LoginService) { }

  ngOnInit() {
    console.log(this.currentImage);
    this.emailForm = new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
      username:new FormControl('',[Validators.required]),
      message:new FormControl(''),
    });

    this.smsForm = new FormGroup({
      phoneNumber:new FormControl('',[Validators.required]),
      username:new FormControl('',[Validators.required]),
      message:new FormControl(''),
    });

    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.getImages();
      this.getEventDetails();
      this.config = {
        url: this.API_URL+'/event-images/'+this.eventId,
        maxFiles: 50,
        clickable: true,
        acceptedFiles: 'image/*',
        createImageThumbnails: true,
        autoReset:1,
        errorReset:1,
        headers:{
          'Authorization': 'Bearer '+this.loginService.getLocalOauthCredential().access_token
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
    // (<any>$('#uploadModal')).modal({backdrop: 'static', keyboard: false})
    (<any>$('#uploadModal')).modal('show');
  }
  onUploadError(event) {
    console.log("Error Occured");
    console.log(event);
  }
  onUploadSuccess(event) {
    console.log("upload success");
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
    console.log("ALL upload is done");
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
    }
    else {
      this.getEventImages();
    }
  }

  getEventImages() {
    // const thisComponent = this;
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
    // const thisComponent = this;
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
    if(this.checkedItems.length==0) {
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

  sendToSlideShow() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      this.eventImageService.sendToSlideShow(this.checkedItems).subscribe((data) => {
          if(data) {
            for(const item of this.checkedItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.resetSelected();
            (<any>$).growl.notice({ message: 'Successfully send to slideshow!' });
          }
        },(err)=> {
          console.log(err.error);
          (<any>$).growl.error({ message: err.error });
        }
      );
    }
  }

  sendViaEmail() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      (<any>$('#sendPhotoViaEmail')).modal('show');
    }
  }
  sendViaSms() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      (<any>$('#sendPhotoViaSms')).modal('show');
    }
  }
  submitSendViaEmail(value) {
    const username = value.username;
    const email = value.email;
    const message = value.message;
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      this.eventImageService.sendViaEmail(this.checkedItems,username,email,message,this.eventId).subscribe((data) => {
          if(data) {
            for(const item of this.checkedItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.resetSelected();
            (<any>$('#sendPhotoViaEmail')).modal('hide');
            (<any>$).growl.notice({ message: 'Successfully send to email!' });
            this.emailForm.reset();
          }
        },(err)=> {
          console.log(err.error);
          (<any>$).growl.error({ message: err.error });
        }
      );
    }
  }
  submitSendViaSms(value) {
    const username = value.username;
    const phoneNumber = value.phoneNumber;
    const message = value.message;
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      this.eventImageService.sendViaSms(this.checkedItems,username,phoneNumber,message,this.eventId).subscribe((data) => {
          if(data) {
            for(const item of this.checkedItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.resetSelected();
            (<any>$('#sendPhotoViaSms')).modal('hide');
            (<any>$).growl.notice({ message: 'Successfully send to sms!' });
            this.smsForm.reset();
          }
        },(err)=> {
          console.log(err.error);
          (<any>$).growl.error({ message: err.error });
        }
      );
    }
  }

  openImageModal(image) {
    console.log("Image Modal Opened");
    this.currentImage = image;
    (<any>$('#image-gallery-image')).attr('src',this.imgPath+image.image);
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
    if(index==0) {
      this.prevBtn = false;
    }
    if(index==totalImage-1) {
      this.nextBtn = false;
    }
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
        // onTotalScroll:function() {
        //   console.log("scrolling done . . .");
        //   if(thisComponent.loadMore) {
        //     thisComponent.offset += thisComponent.limit;
        //     thisComponent.getEventImages();
        //   }
        // }
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

  watermarkedChanged() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No photo selected' });
    } else {
      if (this.selectedWatermarkId != 0) {
        this.eventImageService.addWatermark(this.checkedItems, this.selectedWatermarkId).subscribe((data) => {
            if (data) {
              for(let j = 0; j < data.length; j++) {
                for (let i = 0; i < this.eventImages.length; i++) {
                  if (this.eventImages[i].id == data[j].id) {
                    this.eventImages[i] = data[j];
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
          }
        );
      }
    }
  }

  removeWatermark() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No photo selected' });
    } else {
      this.eventImageService.removeWatermark(this.checkedItems).subscribe((data) => {
          if (data) {
            for(let j = 0; j < data.length; j++) {
              for (let i = 0; i < this.eventImages.length; i++) {
                if (this.eventImages[i].id == data[j].id) {
                  this.eventImages[i] = data[j];
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

  removeFromSlideshow() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No photo selected' });
    } else {
      this.eventImageService.removeFromSlideShow(this.checkedItems).subscribe((data) => {
          if(data) {
            for(const item of this.checkedItems) {
              $('#checkboxFiveInput'+item).prop('checked',false);
            }
            this.removePhotosFromView();
            this.resetSelected();
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
  }

}
