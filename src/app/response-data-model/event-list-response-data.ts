import {Event} from '../datamodel/event';

export class EventListResponseData {
  public events: Event[] = [];
  public count = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
