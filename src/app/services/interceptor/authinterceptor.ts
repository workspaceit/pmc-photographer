import {HttpInterceptor,HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";


import { Observable } from 'rxjs/Observable';
import {Injectable} from "@angular/core";
import {LoginService} from "../login.service";
import {PhotographerLoginService} from "../photographer-login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private photographerLoginService: PhotographerLoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log("interceptor called here ....");
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.photographerLoginService.getLocalOauthCredential().access_token )
    });
    return next.handle(authReq);
  }
}
