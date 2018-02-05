import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {OnlyLoggedInUsersGuard} from './guard';
import {PhotographerModule} from './modules/photographer/photographer.module';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, data: {}
  },
  { path: 'photographer', loadChildren: () => PhotographerModule, canActivate: [OnlyLoggedInUsersGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
