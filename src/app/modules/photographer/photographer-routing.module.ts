import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PhotographerComponent} from './components/photographer/photographer.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {VenueListComponent} from './components/venue-list/venue-list.component';

const routes: Routes = [
  {
    path: '', component: PhotographerComponent,
    children: [
      {path: 'dashboard/locations/page/:page', component: DashboardComponent},
      {path: 'locations/:locationId/venues', component: VenueListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotographerRoutingModule { }
