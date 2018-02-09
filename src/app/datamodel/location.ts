export class Location {
  id: number;
  name: string;
  locationLogo: string;
  createdAt: Date;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
