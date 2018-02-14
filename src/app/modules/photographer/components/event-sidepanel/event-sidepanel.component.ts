import { Component, OnInit } from '@angular/core';
import {EventListResponseData} from '../../../../response/event-list-response';
import {EventService} from '../../../../services/event.service';
import {Event} from '../../../../datamodel/event';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-event-sidepanel',
  templateUrl: './event-sidepanel.component.html',
  styleUrls: ['./event-sidepanel.component.css'],
  providers: [EventService]
})
export class EventSidepanelComponent implements OnInit {

  eventListResponseData: EventListResponseData = new EventListResponseData();

  limit = 6;
  offset = 0;
  currentPage = 1;
  locationId: number;
  eventId: number;
  event: Event;
  responseArrived = false;
  imgPath = environment.pictureUrl;

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

  ngOnInit() {
    this.initialize();
    // this.router.events.subscribe((val) => {
    //   console.log(val);
    // });
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      if(this.locationId != params['locationId']) {
        this.locationId = params['locationId'];
        this.getEvents();
      }
      this.getEventPhotos();
    });
  }

  getEvents(): void {
    this.eventService.getAll(this.locationId, null, this.limit, this.offset).subscribe((responseData) => {
      this.eventListResponseData = responseData;
      this.responseArrived = true;
    });
  }

  getEventPhotos() {
    console.log('fetching event photos . . .');
  }

  getMoreEvents() {
    console.log('get more events');
  }

  initialize() {
    const  thisComponent = this;
    (<any>$("#content-1")).mCustomScrollbar({
      autoHideScrollbar:true,
      mouseWheel:{ scrollAmount: 150 },
      theme:"rounded",
      callbacks:{
        onTotalScroll:function() {
          console.log("scrolling done . . .");
          thisComponent.getMoreEvents();
        }
      }
    });

    $(".collapse-btn2").hide();
    $(".collapse-btn").click(function() {
      $(".sidepanel").animate({
        left: '0px'
      });
      $(this).hide();
      $(".collapse-btn2").show();
    });
    $(".collapse-btn2").click(function() {
      $(".sidepanel").animate({
        left: '-190px'
      });
      $(this).hide();
      $(".collapse-btn").show();
    });
  }

}
