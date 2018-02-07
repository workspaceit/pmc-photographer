import { Component, OnInit } from '@angular/core';
import {LocationService} from '../../../../services/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationListResponse} from '../../../../response/location-list-response';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [LocationService]
})
export class DashboardComponent implements OnInit {

  constructor(private locationService: LocationService, private route: ActivatedRoute, private router: Router, ) { }

  locationListResponse: LocationListResponse = new LocationListResponse();
  limit = 3;
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
        (locationListResponse) => {
          this.locationListResponse = locationListResponse;
          this.responseArrived = true;
        });
  }


  goToVenues(locationId: number): void {
    console.log('go to venue' + locationId);
  }

  pageChanged(pageNumber) {
    console.log(pageNumber);
    this.router.navigate(['photographer-panel/dashboard/locations/page', pageNumber]);
  }

}
