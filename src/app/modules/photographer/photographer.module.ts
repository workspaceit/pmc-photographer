import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotographerRoutingModule } from './photographer-routing.module';
import { PhotographerComponent } from './components/photographer/photographer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TopDockComponent } from './components/top-dock/top-dock.component';
import { LocationListItemComponent } from './components/location-list-item/location-list-item.component';
import { VenueListComponent } from './components/venue-list/venue-list.component';
import { VenueListItemComponent } from './components/venue-list-item/venue-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    PhotographerRoutingModule
  ],
  declarations: [PhotographerComponent, DashboardComponent, TopDockComponent, LocationListItemComponent, VenueListComponent,
    VenueListItemComponent]
})
export class PhotographerModule { }
