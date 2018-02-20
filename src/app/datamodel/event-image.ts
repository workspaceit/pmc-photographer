import {Event} from './event';

export class EventImage {
  id: number;
  event: Event;
  image: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
