import {SECTION_TYPE} from '../constant/section.type';
import {SectionResource} from './section-resource';

export class Section {
  id: number;
  advertisementId: number;
  quantity: number;
  rotation: string;
  sectionType: SECTION_TYPE;
  sectionResource: SectionResource[];
  duration:number;
  createdAt: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
