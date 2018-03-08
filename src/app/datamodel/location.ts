export class Location {
  id: number;
  name: string;
  address:String;
  locationLogo: string;
  createdAt: Date;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
