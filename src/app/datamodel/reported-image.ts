import {EventImage} from './event-image';

export class ReportedImage {
  id: number;
  eventImage: EventImage = null;
  actionTaken: boolean;
  reportedAt: string ;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
