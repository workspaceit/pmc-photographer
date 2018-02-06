import {Component, Input, OnInit} from '@angular/core';
import {Location} from '../../../../datamodel/location';

@Component({
  selector: 'app-location-list-item',
  templateUrl: './location-list-item.component.html',
  styleUrls: ['./location-list-item.component.css']
})
export class LocationListItemComponent implements OnInit {

  @Input()
  location: Location;

  constructor() { }

  ngOnInit() {
    const eventOrder = $('.event-order');
    eventOrder.height(eventOrder.width());
  }

}
