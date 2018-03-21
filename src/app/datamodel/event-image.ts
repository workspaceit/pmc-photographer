import {Event} from './event';

export class EventImage {
  id: number;
  event: Event = null
  image:string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
