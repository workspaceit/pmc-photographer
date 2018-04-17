import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GalleryComponent } from './components/gallery/gallery.component';
import { UserComponent } from './components/user/user.component';
import { TopDockComponent } from './components/top-dock/top-dock.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';
import { AdbannerComponent } from './components/adbanner/adbanner.component';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    ShareButtonsModule
  ],
  declarations: [GalleryComponent, UserComponent, TopDockComponent, SlideshowComponent, AdbannerComponent]
})
export class UserModule { }
