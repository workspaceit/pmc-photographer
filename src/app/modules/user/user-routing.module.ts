import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './components/user/user.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import {SlideshowComponent} from './components/slideshow/slideshow.component';

const routes: Routes = [{
  path:'',
  component:UserComponent,
  children:[
    {
      path:'gallery',
      component:GalleryComponent
    },
    {
      path:'slideshow',
      component:SlideshowComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
