import {Event} from '../datamodel/event';

export class EventListResponse {
  events: Event[] = [];
  count = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
