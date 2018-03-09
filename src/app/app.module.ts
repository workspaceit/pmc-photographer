import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {OnlyLoggedInUsersGuard} from './guard';
import {PhotographerLoginService} from './services/photographer-login.service';
import * as $ from 'jquery';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {FormsModule} from '@angular/forms';
import {ShareButtonsModule} from 'ngx-sharebuttons';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    NgxPaginationModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    LoadingBarModule.forRoot(),
    ShareButtonsModule.forRoot(),
  ],
  providers: [PhotographerLoginService, OnlyLoggedInUsersGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
