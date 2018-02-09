import {Component, Input, OnInit} from '@angular/core';
import {Venue} from '../../../../datamodel/venue';

@Component({
  selector: 'app-venue-list-item',
  templateUrl: './venue-list-item.component.html',
  styleUrls: ['./venue-list-item.component.css']
})
export class VenueListItemComponent implements OnInit {

  @Input()
  venue: Venue;

  constructor() { }

  ngOnInit() {
    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });
    $('.folder').height($('.folder').width());
  }

}
