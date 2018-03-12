import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GalleryadComponent} from './components/galleryad/galleryad.component';
import {PreviewComponent} from './components/preview/preview.component';
import {SlideshowadComponent} from './components/slideshowad/slideshowad.component';

const routes: Routes = [{
  path:'',
  component:PreviewComponent,
  children:[
      { path:'gallery',component:GalleryadComponent},
      { path:'slideshow',component:SlideshowadComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class PreviewRoutingModule { }
