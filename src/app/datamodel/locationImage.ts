export class LocationImage{
  id:number;
  image:string;
  locationId:number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
