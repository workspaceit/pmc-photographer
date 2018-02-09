import {Venue} from '../datamodel/venue';

export class VenueListResponseData {
  venues: Venue[] = [];
  count =  0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
