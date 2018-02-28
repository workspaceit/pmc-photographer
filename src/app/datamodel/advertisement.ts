import {AdvertisementDetails} from './advertisement.details';

export class Advertisement{
    GALLERY:AdvertisementDetails;
    SLIDESHOW:AdvertisementDetails;
    POPUP_EMAIL:AdvertisementDetails;
    POPUP_SMS:AdvertisementDetails;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
