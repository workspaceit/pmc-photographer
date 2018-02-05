import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css']
})
export class VenueListComponent implements OnInit {

  venues: [number] = [1, 1, 1, 1, 1, 1];

  constructor() { }

  ngOnInit() {
  }

}
