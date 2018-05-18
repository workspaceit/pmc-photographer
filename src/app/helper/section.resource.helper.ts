import {SectionResource} from '../datamodel/section-resource';
import {environment} from '../../environments/environment';

export class SectionResourceHelper{
  private static resourcePath = environment.pictureUrl;
  public static getGalleryBannerSelectedStatic(sectionResources :SectionResource[] ){
    let  tmpPath = (sectionResources.length>0) ? SectionResourceHelper.resourcePath+sectionResources[0].fileName:'';
    let imageObj = {path:tmpPath,url:sectionResources[0].url};

    for(let i=0;i<sectionResources.length;i++){
      if(!sectionResources[i].selectedStatic)continue;

      tmpPath = (sectionResources.length>0) ? SectionResourceHelper.resourcePath+sectionResources[i].fileName:'';
      imageObj = {path:tmpPath,url:sectionResources[i].url};
      break;
    }
    return imageObj;
  }
  public static getSelectedStaticSectionResource(sectionResources :SectionResource[] ){
    let imageObj = sectionResources[0];

    for(let i=0;i<sectionResources.length;i++){
      if(!sectionResources[i].selectedStatic)continue;
      imageObj = sectionResources[i];
      break;
    }
    return imageObj;
  }
}
