export class City {
  id: number;
  name: string;
  stateId: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
