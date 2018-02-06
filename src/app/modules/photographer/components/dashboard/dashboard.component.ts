import { Component, OnInit } from '@angular/core';
import {LocationService} from '../../../../services/location.service';
import {Location} from '../../../../datamodel/location';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [LocationService]
})
export class DashboardComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  locations: Location[];

  ngOnInit() {
    this.getLocations();
  }

  getLocations(): void {
    console.log('here i am');
    this.locationService.getLocations()
      .subscribe(locations => this.locations = locations);
  }

  goToVenues(locationId: number): void {
    console.log('go to venue' + locationId);
  }

}
