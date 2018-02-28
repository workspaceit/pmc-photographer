import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GalleryComponent } from './components/gallery/gallery.component';
import { UserComponent } from './components/user/user.component';
import { TopDockComponent } from './components/top-dock/top-dock.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [GalleryComponent, UserComponent, TopDockComponent]
})
export class UserModule { }
