import { Component, OnInit } from '@angular/core';
import {Event} from '../../../../datamodel/event';
import {EventService} from '../../../../services/event.service';
import {EventListResponseData} from '../../../../response/event-list-response';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationService} from '../../../../services/location.service';
import {Location} from '../../../../datamodel/location';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  providers: [EventService, LocationService]
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  locationId: number;
  location: Location = new Location();
  eventListResponseData: EventListResponseData = new EventListResponseData();
  limit = 3;
  offset = 0;
  currentPage = 1;
  responseArrived = false;
  filterDate = null;
  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService,
               private locationService: LocationService) { }

  ngOnInit() {

    const thisComponent = this;

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap',
      format: 'yyyy-mm-dd',
      change: function (e) {
        const filterDate = $(this).val();
        thisComponent.filterDate = filterDate;
        console.log(filterDate);
        thisComponent.initialize();
        thisComponent.getEvents();
      }
    });

    this.route.params.subscribe(params => {
      this.locationId = params['locationId'];
      this.offset = (this.currentPage * this.limit) - this.limit;
      this.getEvents();
      this.getLocationById();
    });
  }

  initialize(): void {
    this.offset = 0;
    this.currentPage = 1;
    this.responseArrived = false;
  }

  getLocationById(): void {
    this.locationService.getLocationById(this.locationId)
      .subscribe(location => this.location = location);
  }

  getEvents(): void {
    this.eventService.getAll(this.locationId, this.filterDate, this.limit, this.offset).subscribe((responseData) => {
      this.eventListResponseData = responseData;
      this.responseArrived = true;
    });
  }

  pageChanged(pageNumber) {
    this.offset = (pageNumber * this.limit) - this.limit;
    this.getEvents();
    this.currentPage = pageNumber;
  }

}
