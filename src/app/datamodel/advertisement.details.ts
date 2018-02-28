import {ADVERTISEMENT_TYPE} from '../constant/advertisement.type';
import {Section} from './section';

export class AdvertisementDetails{
  id: number;
  advertiserId:  number;
  adType: ADVERTISEMENT_TYPE;
  state:string;
  sections: {LOGO:Section,TOP_BANNER:Section,BOTTOM_BANNER:Section,BACKGROUND:Section,BANNER:Section,};

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
