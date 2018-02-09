import { Component, OnInit } from '@angular/core';
import {Event} from '../../../../datamodel/event';
import {EventServiceService} from '../../../../services/event.service.service';
import {EventListResponse} from '../../../../response/event-list-response';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  providers: [EventServiceService]
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  eventListResponse: EventListResponse = new EventListResponse();
  limit = 5;
  offset = 0;
  currentPage = 1;
  sub: any;
  responseArrived = false;
  totalEventCount = 0;
  constructor(private eventServiceService: EventServiceService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.eventServiceService.getCount().subscribe((responseData) => {this.totalEventCount = responseData.count });

    this.route.params.subscribe(params => {
        this.currentPage = +params['page'];
        this.offset = this.currentPage - 1;
          this.eventServiceService.getAll(this.limit,this.offset).subscribe((responseData)=>{
            this.eventListResponse = responseData;
            this.responseArrived = true;
          });
        });
  }

  pageChanged(pageNumber) {
    this.router.navigate(['photographer-panel/event/page/', pageNumber]);
  }
}
