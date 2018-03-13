import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreviewRoutingModule } from './preview-routing.module';
import { GalleryadComponent } from './components/galleryad/galleryad.component';
import { SlideshowadComponent } from './components/slideshowad/slideshowad.component';
import { PreviewComponent } from './components/preview/preview.component';

@NgModule({
  imports: [
    CommonModule,
    PreviewRoutingModule
  ],
  declarations: [GalleryadComponent, SlideshowadComponent, PreviewComponent]
})
export class PreviewModule { }
