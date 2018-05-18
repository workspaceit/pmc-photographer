export class NavigationHelper{
  public static openAdUrl(url:string){

    if(url!==null && url.trim()!==''){
      window.open(url, "_blank");
    }

  }
}
