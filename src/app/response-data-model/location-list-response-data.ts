import {Location} from '../datamodel/location';

export class LocationListResponseData {
  locations: Location[] = [];
  count =  0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
