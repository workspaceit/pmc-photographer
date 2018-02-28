import {Watermark} from './watermark';

export class Event {
  id: number;
  name: string;
  eventPhoto: string;
  startsAt: string ;
  endsAt: string ;
  eventPrivate: boolean;
  watermarks: Watermark[] = [];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
