import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-list-item',
  templateUrl: './location-list-item.component.html',
  styleUrls: ['./location-list-item.component.css']
})
export class LocationListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const eventOrder = $('.event-order');
    eventOrder.height(eventOrder.width());
  }

}
