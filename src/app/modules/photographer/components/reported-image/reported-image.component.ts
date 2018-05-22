import {ActivatedRoute, Router} from '@angular/router';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EventImageService} from "../../../../services/event-image.service";
import {DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {EventDetailsResponseData} from "../../../../response-data-model/event-details-response-data";
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../../../environments/environment";
import {EventImage} from "../../../../datamodel/event-image";
import {EventService} from "../../../../services/event.service";
import {LoginService} from "../../../../services/login.service";
import {ReportedImage} from "../../../../datamodel/reported-image";

@Component({
  selector: 'app-reported-image',
  templateUrl: './reported-image.component.html',
  styleUrls: ['./reported-image.component.css'],
  providers: [EventImageService, EventService, LoginService]
})
export class ReportedImageComponent implements OnInit, AfterViewInit  {
  eventId: number;
  eventDetailsResponseData: EventDetailsResponseData = new EventDetailsResponseData();
  reportedImages: ReportedImage[] = [];
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
  currentImage: ReportedImage= new ReportedImage();
  nextBtn = true;
  prevBtn = true;
  emailForm: FormGroup;
  smsForm: FormGroup;
  slideShowImagesOnly = false;

  constructor(private route: ActivatedRoute, private router: Router, private eventImageService: EventImageService,
              private eventService: EventService,private  loginService: LoginService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.offset = 0;
      this.slideShowImagesOnly = false;
      this.reportedImages = [];
      this.getImages();
      this.getEventDetails();
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
  getEventDetails() {
    this.eventService.getEventDetails(this.eventId).subscribe((data) => {
      this.eventDetailsResponseData = data;
    });
  }

  getImages() {
    this.eventImageService.getReportedImage(this.eventId).subscribe((data)=> {
      this.reportedImages = data;
      this.adjustHeight();
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
      const index = this.checkedItems.indexOf(eventImage.eventImage.id);
      if(index<0) {
        this.checkedItems=this.checkedItems.concat(eventImage.eventImage.id);
      }
    } else {
      const index = this.checkedItems.indexOf(eventImage.eventImage.id);
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
      this.eventImageService.deleteReportedEventImages(this.checkedItems).subscribe((data) => {
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
  ignore() {
    if(this.checkedItems.length==0) {
      (<any>$).growl.warning({ message: 'No items selected' });
    } else {
      this.eventImageService.ignoreReportedEventImages(this.checkedItems).subscribe((data) => {
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
      this.reportedImages = this.reportedImages.filter(data=>data.eventImage.id !== item);
    }
  }
  openImageModal(image) {
    console.log("Image Modal Opened");
    this.currentImage = image;
    (<any>$('#image-gallery-image')).attr('src',this.imgPath+image.eventImage.image);
    (<any>$('#image-gallery')).modal('show');
    const currentImageIndex = this.reportedImages.indexOf(this.currentImage);
    this.displayPrevNext(currentImageIndex);
  }
  showNextImage() {
    const currentImageIndex = this.reportedImages.indexOf(this.currentImage);
    const nextImageIndex = currentImageIndex+1;
    const totalImage = this.reportedImages.length;
    if(nextImageIndex<=totalImage-1) {
      this.currentImage = this.reportedImages[nextImageIndex];
      this.displayPrevNext(nextImageIndex);
    }
  }
  showPreviousImage() {
    const currentImageIndex = this.reportedImages.indexOf(this.currentImage);
    const previousImageIndex = currentImageIndex-1;
    if(previousImageIndex>=0) {
      this.currentImage = this.reportedImages[previousImageIndex];
      this.displayPrevNext(previousImageIndex);
    }
  }
  displayPrevNext(index) {
    const totalImage = this.reportedImages.length;
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
    // (<any>$("#content-2")).mCustomScrollbar({
    //   autoHideScrollbar:true,
    //   mouseWheel:{ scrollAmount: 200 },
    //   theme:"rounded",
    //   callbacks:{
    //     onTotalScrollOffset: 200,
    //     whileScrolling: function() {
    //       // console.log(this.mcs.topPct);
    //       if(this.mcs.topPct > 90) {
    //         // console.log("scrolling done . . .");
    //         if(thisComponent.loadMore) {
    //           thisComponent.offset += thisComponent.limit;
    //           thisComponent.getImages();
    //         }
    //       }
    //     },
    //     // onTotalScroll:function() {
    //     //   console.log("scrolling done . . .");
    //     //   if(thisComponent.loadMore) {
    //     //     thisComponent.offset += thisComponent.limit;
    //     //     thisComponent.getEventImages();
    //     //   }
    //     // }
    //   }
    // });

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
  initializeValues() {
    this.offset = 0;
    this.reportedImages = [];
    this.enableEdit = false;
  }

}
