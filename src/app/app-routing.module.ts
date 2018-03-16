import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {ResetPasswordComponentComponent} from "./components/reset-password-component/reset-password-component.component";
import {OnlyLoggedInUsersGuard,UpdatePasswordGuard} from './guard';
import {PasswordTokenVerifyComponent} from "./components/password-token-verify/password-token-verify.component";
import {UpdatePasswordComponent} from "./components/update-password/update-password.component";

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, data: {}
  },
  {
    path: 'reset-password', component: ResetPasswordComponentComponent, data: {}
  },
  {
    path: 'reset-password-verify/:id/:token', component: PasswordTokenVerifyComponent, data: {}
  },
  {
    path: 'update-password', component: UpdatePasswordComponent, data: {},canActivate:[UpdatePasswordGuard]
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
