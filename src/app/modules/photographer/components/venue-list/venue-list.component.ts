import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VenueService} from '../../../../services/venue.service';
import {Venue} from '../../../../datamodel/venue';
import {LocationService} from '../../../../services/location.service';
import {Location} from '../../../../datamodel/location';
import {VenueListResponseData} from '../../../../response-data-model/venue-list-response-data';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css'],
  providers: [VenueService, LocationService]
})
export class VenueListComponent implements OnInit {

  location: Location = new Location();
  venueListResponseData: VenueListResponseData = new VenueListResponseData();
  sub: any;
  locationId: number;

  limit = 6;
  offset = 0;
  currentPage = 1;
  responseArrived = false;

  constructor(private router: Router, private route: ActivatedRoute, private venueService: VenueService,
              private locationService: LocationService) { }

  ngOnInit() {

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });

    this.sub = this.route.params.subscribe(params => {
      this.locationId = params['locationId'];
      console.log(this.locationId);
      this.getVenuesByLocation();
      this.getLocationById();
    });
  }

  getVenuesByLocation(): void {
    this.venueService.getVenuesByLocation(this.locationId, this.limit, this.offset)
      .subscribe(venueListResponseData => this.venueListResponseData = venueListResponseData);
  }

  getLocationById(): void {
    this.locationService.getLocationById(this.locationId)
      .subscribe(location => this.location = location);
  }

  pageChanged(pageNumber) {
    console.log(pageNumber);
    this.router.navigate(['photographer-panel/locations/' + this.locationId + 'venues/page', pageNumber]);
  }

}
