import {Location} from '../datamodel/location';

export class LocationListResponse {
  locations: Location[] = [];
  count =  0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
