import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GalleryComponent } from './components/gallery/gallery.component';
import { UserComponent } from './components/user/user.component';
import { TopDockComponent } from './components/top-dock/top-dock.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';
import { AdbannerComponent } from './components/adbanner/adbanner.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [GalleryComponent, UserComponent, TopDockComponent, SlideshowComponent, AdbannerComponent]
})
export class UserModule { }
