import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Swiper, Navigation, Pagination, Scrollbar } from 'swiper/dist/js/swiper.esm.js';
import {EventImageService} from '../../../../services/event-image.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {EventImage} from '../../../../datamodel/event-image';
import {EventDetailsResponseData} from '../../../../response-data-model/event-details-response-data';
import {EventService} from '../../../../services/event.service';
import {LoginService} from '../../../../services/login.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

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

  constructor(private route: ActivatedRoute, private router: Router, private eventImageService: EventImageService,
              private eventService: EventService,private  loginService: LoginService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.getEventImages();
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
    console.log('something changed');
    setTimeout(function() {
      thisComponent.adjustHeight();
    }, 0);
  }

  adjustHeight() {
    setTimeout(function() {
      $('.thumb').height($('.thumb').width());
    }, 0);
  }

  test() {
    this.getEventImages();
  }

  uploadModal() {
    console.log("clicked to open upload modal");
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
    console.log("ALL upload is done");
    (<any>$('#uploadModal')).modal('hide');
    // this.getEventImages();
  }
  getEventDetails() {
    this.eventService.getEventDetails(this.eventId).subscribe((data) => {
      this.eventDetailsResponseData = data;
    });
  }

  getEventImages() {
    const  thisComponent = this;
    this.eventImageService.getEventImages(this.eventId, this.limit, this.offset).subscribe((data) => {
      this.eventImages = data;
      this.adjustHeight();
    });
  }
  getMoreEventImages() {
    const  thisComponent = this;
    this.offset += this.limit;
    this.eventImageService.getEventImages(this.eventId, this.limit, this.offset).subscribe((data) => {
      if(data.length==0) {
        this.loadMore = false;
      } else {
        this.eventImages=this.eventImages.concat(data);
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
  initialize() {
    const  thisComponent = this;
    (<any>$("#content-2")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 150 },
      theme:"rounded",
      callbacks:{
        onTotalScroll:function() {
          console.log("scrolling done . . .");
          if(thisComponent.loadMore) {
            thisComponent.getMoreEventImages();
          }
        }
      }
    });

    $(".img-check").click(function() {
      $(this).toggleClass("check");
    });

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });

    (<any>$('[data-toggle="tooltip"]')).tooltip();

    // $("#doneEdit").hide();
    // $("#editEvent").click(function(){
    //   $(this).hide();
    //   $(".toggler").show();
    //   $(".togglerFace").hide();
    //   $("#doneEdit").show();
    //   $("#deleteTrash").show();
    // });
    // $("#doneEdit").click(function() {
    //   $(this).hide();
    //   $(".toggler").hide();
    //   $(".togglerFace").show();
    //   $("#editEvent").show();
    //   $("#deleteTrash").hide();
    // });
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

  loadGallery(setIDs, setClickAttr) {
    const thisComponent = this;
    let current_image,
      selector,
      counter = 0;

    $('#show-next-image, #show-previous-image').click(function() {
      if($(this).attr('id') === 'show-previous-image') {
        current_image--;
      } else {
        current_image++;
      }

      selector = $('[data-image-id="' + current_image + '"]');
      thisComponent.updateGallery(selector, counter);
    });

    if (setIDs == true) {
      $('[data-image-id]').each(function() {
        counter++;
        $(this).attr('data-image-id', counter);
      });
    }
    $(setClickAttr).on('click',function() {
      thisComponent.updateGallery($(this), counter);
    });
  }

  updateGallery(selector, counter) {
    const $sel = selector;
    const current_image = $sel.data('image-id');
    $('#image-gallery-caption').text($sel.data('caption'));
    $('#image-gallery-title').text($sel.data('title'));
    $('#image-gallery-image').attr('src', $sel.data('image'));
    this.disableButtons(counter, $sel.data('image-id'));
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

}
