import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PhotographerComponent} from './components/photographer/photographer.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {VenueListComponent} from './components/venue-list/venue-list.component';
import {EventListComponent} from './components/event-list/event-list.component';
import {LocationListComponent} from './components/location-list/location-list.component';

const routes: Routes = [
  {
    path: '', component: PhotographerComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'locations', component: LocationListComponent},
      {path: 'locations/:locationId/venues', component: VenueListComponent},
      {path: 'locations/:locationId/events', component: EventListComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotographerRoutingModule { }
