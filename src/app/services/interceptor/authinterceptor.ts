import {HttpInterceptor,HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";


import { Observable } from 'rxjs/Observable';
import {Injectable} from "@angular/core";
import {LoginService} from "../login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("interceptor called here ....");
    const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.loginService.getLocalOauthCredential().access_token )});
    return next.handle(authReq);
  }
}
