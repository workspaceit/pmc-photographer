export class Location {
  id: number;
  name: string;
  locationLogo: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
