import {Event} from './event';
import {Watermark} from "./watermark";

export class EventImage {
  id: number;
  event: Event = null
  image:string;
  watermark: Watermark;
  inSlideshow: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
