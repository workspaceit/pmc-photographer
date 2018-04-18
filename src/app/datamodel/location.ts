import {City} from './city';
import {State} from './state';
import {LocationImage} from './locationImage';

export class Location {
  id: number;
  name: string;
  address:string;
  city:City;
  state:State;
  zip:string;
  locationLogo: string;
  phone:string;
  createdAt: Date;
  locationBackgroundImages: LocationImage[];

  durationSpeed: number;
  fadeInTime: number;
  fadeOutTime: number;
  hasSlideshow: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
