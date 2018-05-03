import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse} from "@angular/common/http";


import { Observable } from 'rxjs/Observable';
import {Injectable} from "@angular/core";
import {LoginService} from "../login.service";
import {PhotographerLoginService} from "../photographer-login.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private photographerLoginService: PhotographerLoginService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log("interceptor called here ....");
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.photographerLoginService.getLocalOauthCredential().access_token )
    });
    return next.handle(authReq).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // console.log(1);
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        // console.log(err.status);
        if (err.status === 401) {
          this.photographerLoginService.removeLocalOauthCredential();
          this.photographerLoginService.removeLocalUserDetails();
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
