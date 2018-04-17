import {Watermark} from './watermark';
import {Location} from './location';

export class Event {
  id: number;
  name: string;
  eventPhoto: string;
  startsAt: string ;
  endsAt: string ;
  eventPrivate: boolean;
  watermarks: Watermark[] = [];
  location:Location = new Location();
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
