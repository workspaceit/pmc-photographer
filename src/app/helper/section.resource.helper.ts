import {SectionResource} from '../datamodel/section-resource';
import {environment} from '../../environments/environment';
import {Advertisement} from '../datamodel/advertisement';
import {AdvertisementDetails} from '../datamodel/advertisement.details';
import {Section} from '../datamodel/section';

export class SectionResourceUtil{
  private static resourcePath = environment.pictureUrl;
  public static getGalleryBannerSelectedStatic(sectionResources :SectionResource[] ){
    let  tmpPath = (sectionResources.length>0) ? SectionResourceUtil.resourcePath+sectionResources[0].fileName:'';
    let imageObj = {path:tmpPath,url:sectionResources[0].url};

    for(let i=0;i<sectionResources.length;i++){
      if(!sectionResources[i].selectedStatic)continue;

      tmpPath = (sectionResources.length>0) ? SectionResourceUtil.resourcePath+sectionResources[i].fileName:'';
      imageObj = {path:tmpPath,url:sectionResources[i].url};
      break;
    }
    return imageObj;
  }
  public static getSelectedStaticSectionResource(sectionResources :SectionResource[] ):SectionResource{
    if(sectionResources===null || sectionResources.length===0){
      return null;
    }

    let imageObj = sectionResources[0];

    for(let i=0;i<sectionResources.length;i++){
      if(!sectionResources[i].selectedStatic)continue;
      imageObj = sectionResources[i];
      break;
    }
    return imageObj;
  }
  /**
   * Advertiser wise section resources
   * */
  public static getRoundWiseSectionResource(advertisements:AdvertisementDetails[],sectionType:string){

    let sectionResources = [[]];
    const maxRoundCount = SectionResourceUtil.getMaxRound(advertisements,sectionType);
    for(let roundCount=0;roundCount<maxRoundCount;roundCount++) {
      let perRoundSection = [] ;
      for (const i in advertisements) {

        const advertiserDetails:AdvertisementDetails = advertisements[i];
        const section:Section= advertiserDetails.sections[sectionType];
        const sectionResource:SectionResource[] = section.sectionResource;

        /**
         * For every round image will be same
         * */
        if(section.rotation==='STATIC'){
          const selectedStaticSecRes:SectionResource =  SectionResourceUtil.getSelectedStaticSectionResource(sectionResource);
          if (selectedStaticSecRes !== null ){
            perRoundSection.push(selectedStaticSecRes);
            continue;
          }
        }

        if(roundCount>=sectionResource.length){continue;}

        let secRes = sectionResource[roundCount];
        perRoundSection.push(secRes);
      }
      sectionResources[roundCount] = perRoundSection;
    }
    return sectionResources;
  }
  private static getMaxRound(advertisements:AdvertisementDetails[],sectionType:string){
    let maxRound = 0;
    for(const i in advertisements){
      const advertiserDetails:AdvertisementDetails = advertisements[i];
      const section:Section= advertiserDetails.sections[sectionType];
      if(section.rotation==='ROTATE' && maxRound < section.quantity){
        maxRound = section.quantity;
      }
    }
    return maxRound;
  }
}
