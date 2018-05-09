import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {ResetPasswordComponentComponent} from "./components/reset-password-component/reset-password-component.component";
import {OnlyLoggedInUsersGuard,UpdatePasswordGuard} from './guard';
import {PasswordTokenVerifyComponent} from "./components/password-token-verify/password-token-verify.component";
import {UpdatePasswordComponent} from "./components/update-password/update-password.component";
//import {AdminPhotographerLoginComponent} from "./modules/photographer/components/admin-photographer-login/admin-photographer-login.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  //{ path: 'admin-photographer-login', component: AdminPhotographerLoginComponent },
  { path: 'reset-password', component: ResetPasswordComponentComponent },
  { path: 'reset-password-verify/:id/:token', component: PasswordTokenVerifyComponent },
  { path: 'update-password', component: UpdatePasswordComponent, data: {},canActivate:[UpdatePasswordGuard] },
  { path: 'photographer-panel', loadChildren: './modules/photographer/photographer.module#PhotographerModule',
    canActivate: [OnlyLoggedInUsersGuard] },
  { path: 'user-panel', loadChildren: './modules/user/user.module#UserModule' },
  { path: 'pmcad-preview', loadChildren: './modules/preview/preview.module#PreviewModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
