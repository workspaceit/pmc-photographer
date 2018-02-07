export class Event {
  id: number;
  name: string;
  eventPhoto:string;
  startsAt: string ;
  endsAt: string ;
  eventPrivate: boolean;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
