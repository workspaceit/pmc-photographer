import { Pipe, PipeTransform } from '@angular/core';
import {Photographer} from "../../../datamodel/photographer";


@Pipe({
  name: 'filteredPhotographers',
  pure: true
})
export class FilteredPhotographersPipe implements PipeTransform {

  transform(photographers: Photographer[], searchTerm: string): Photographer[] {
    if(searchTerm === ''){
      return photographers;
    }
    return  photographers.filter(photographer => photographer.fullName.toLowerCase().startsWith(searchTerm.toLowerCase()));
  }

}
