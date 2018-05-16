import {Event} from '../datamodel/event';

export class EventDetailsResponseData {
  imageCount: number;
  slideshowImageCount: number;
  reportedImageCount: number;
  event: Event = new Event();
}
