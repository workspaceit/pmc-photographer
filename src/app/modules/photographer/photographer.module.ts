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
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import { ReportedImageComponent } from './components/reported-image/reported-image.component';
import {PhotographerLoginService} from "../../services/photographer-login.service";
import {LoginService} from "../../services/login.service";
import {AdminPhotographerLoginComponent} from "./components/admin-photographer-login/admin-photographer-login.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PhotographerRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    DropzoneModule,
    ShareButtonsModule.forRoot(),
  ],
  declarations: [PhotographerComponent,
    DashboardComponent,
    TopDockComponent,
    LocationListItemComponent,
    EventListComponent,
    EventListItemComponent,
    LocationListComponent,
    EventDashboardComponent,
    EventSidepanelComponent,
    ReportedImageComponent,
    AdminPhotographerLoginComponent
  ],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, PhotographerLoginService, LoginService
  ]
})
export class PhotographerModule { }
