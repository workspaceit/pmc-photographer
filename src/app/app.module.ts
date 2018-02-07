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




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [PhotographerLoginService, OnlyLoggedInUsersGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
