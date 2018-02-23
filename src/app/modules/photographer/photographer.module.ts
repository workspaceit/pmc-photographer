import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotographerRoutingModule } from './photographer-routing.module';
import { PhotographerComponent } from './components/photographer/photographer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TopDockComponent } from './components/top-dock/top-dock.component';
import { LocationListItemComponent } from './components/location-list-item/location-list-item.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {LocationListComponent} from './components/location-list/location-list.component';
import { EventDashboardComponent } from './components/event-dashboard/event-dashboard.component';
import { EventSidepanelComponent } from './components/event-sidepanel/event-sidepanel.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthInterceptor} from '../../services/interceptor/authinterceptor';
import {LoginService} from "../../services/login.service";
import { DropzoneModule } from 'ngx-dropzone-wrapper';

@NgModule({
  imports: [
    CommonModule,
    PhotographerRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    DropzoneModule
  ],
  declarations: [PhotographerComponent,
    DashboardComponent,
    TopDockComponent,
    LocationListItemComponent,
    EventListComponent,
    EventListItemComponent,
    LocationListComponent,
    EventDashboardComponent,
    EventSidepanelComponent],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },LoginService
  ]
})
export class PhotographerModule { }
