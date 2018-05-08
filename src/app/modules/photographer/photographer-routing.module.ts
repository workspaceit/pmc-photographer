import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PhotographerComponent} from './components/photographer/photographer.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {EventListComponent} from './components/event-list/event-list.component';
import {LocationListComponent} from './components/location-list/location-list.component';
import {EventDashboardComponent} from './components/event-dashboard/event-dashboard.component';
import {ReportedImageComponent} from "./components/reported-image/reported-image.component";
import {AdminPhotographerLoginComponent} from "./components/admin-photographer-login/admin-photographer-login.component";

const routes: Routes = [
  {
    path: '', component: PhotographerComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'locations', component: LocationListComponent },
      { path: 'admin-login', component: AdminPhotographerLoginComponent },
      { path: 'locations/:locationId/events', component: EventListComponent },
      { path: 'locations/:locationId/events/:eventId', component: EventDashboardComponent },
      { path: 'locations/:locationId/events/:eventId/reported-images', component: ReportedImageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotographerRoutingModule { }
