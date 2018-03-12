import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {OnlyLoggedInUsersGuard} from './guard';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, data: {}
  },
  // { path: 'photographer-panel', loadChildren: () => PhotographerModule, canActivate: [OnlyLoggedInUsersGuard]},
  { path: 'photographer-panel', loadChildren: './modules/photographer/photographer.module#PhotographerModule',
    canActivate: [OnlyLoggedInUsersGuard]
  },
  { path: 'user-panel', loadChildren: './modules/user/user.module#UserModule',
    canActivate: [OnlyLoggedInUsersGuard]
  },
  { path: 'pmcad-preview', loadChildren: './modules/preview/preview.module#PreviewModule',
    canActivate: [OnlyLoggedInUsersGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
