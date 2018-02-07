import { Component, OnInit, Input } from '@angular/core';
import {Event} from '../../../../datamodel/event';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.css']
})
export class EventListItemComponent implements OnInit {

  @Input()
  pmcEvent: Event;

  imgPath = environment.pictureUrl;

  constructor() {  }

  ngOnInit() {
    const eventOrder = $('.folder');
    eventOrder.height(eventOrder.width());
  }

}
