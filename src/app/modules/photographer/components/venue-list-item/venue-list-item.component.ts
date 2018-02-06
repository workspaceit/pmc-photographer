import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-venue-list-item',
  templateUrl: './venue-list-item.component.html',
  styleUrls: ['./venue-list-item.component.css']
})
export class VenueListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // $('#datepicker').datepicker({
    //   uiLibrary: 'bootstrap'
    // });
    $('.folder').height($('.folder').width());
  }

}
