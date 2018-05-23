import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {OnlyLoggedInUsersGuard,UpdatePasswordGuard} from './guard';
import {PhotographerLoginService} from './services/photographer-login.service';
import * as $ from 'jquery';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import { ResetPasswordComponentComponent } from './components/reset-password-component/reset-password-component.component';
import {ResetpasswordService} from "./services/resetpassword.service";
import { PasswordTokenVerifyComponent } from './components/password-token-verify/password-token-verify.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import {LoginService} from "./services/login.service";
import { FourZeroFourComponent } from './components/four-zero-four/four-zero-four.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponentComponent,
    PasswordTokenVerifyComponent,
    UpdatePasswordComponent,
    FourZeroFourComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    NgxPaginationModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    LoadingBarModule.forRoot(),
    ShareButtonsModule.forRoot(),
  ],
  providers: [LoginService, PhotographerLoginService, OnlyLoggedInUsersGuard,ResetpasswordService,UpdatePasswordGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
