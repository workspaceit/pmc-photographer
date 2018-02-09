import { Component, OnInit } from '@angular/core';
import {LocationListResponseData} from '../../../../response-data-model/location-list-response-data';
import {LocationService} from '../../../../services/location.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css'],
  providers: [LocationService]
})
export class LocationListComponent implements OnInit {

  constructor(private locationService: LocationService, private route: ActivatedRoute, private router: Router, ) { }

  locationListResponseData: LocationListResponseData = new LocationListResponseData();
  limit = 6;
  offset = 0;
  currentPage = 1;
  sub: any;
  responseArrived = false;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.currentPage = +params['page'];
      this.offset = (this.currentPage * this.limit) - this.limit;
      this.getLocations();
    });
  }

  getLocations() {
    this.locationService.getLocations(this.limit, this.offset)
      .subscribe(
        (locationListResponseData) => {
          this.locationListResponseData = locationListResponseData;
          this.responseArrived = true;
        });
  }

  pageChanged(pageNumber) {
    console.log(pageNumber);
    this.router.navigate(['photographer-panel/locations/page', pageNumber]);
  }

}
