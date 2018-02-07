import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VenueService} from '../../../../services/venue.service';
import {Venue} from '../../../../datamodel/venue';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css'],
  providers: [VenueService]
})
export class VenueListComponent implements OnInit {

  venues: Venue[];
  sub: any;
  locationId: number;

  constructor(private router: Router, private route: ActivatedRoute, private venueService: VenueService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.locationId = params['locationId'];
      console.log(this.locationId);
      this.getVenuesByLocation();
    });
  }

  getVenuesByLocation(): void {
    this.venueService.getVenuesByLocation(this.locationId)
      .subscribe(venues => this.venues = venues);
  }

}
