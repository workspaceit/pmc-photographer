import { Component, OnInit } from '@angular/core';
import {Event} from '../../../../datamodel/event';
import {EventServiceService} from '../../../../services/event.service.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  providers: [EventServiceService]
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  constructor(private eventServiceService: EventServiceService) { }
  ngOnInit() {


    this.eventServiceService.getAll(2,0).subscribe(events => this.events = events);

  }
}
