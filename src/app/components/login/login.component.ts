import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../services/login.service';
import {OauthCredential} from '../../datamodel/oauth.creadential';
import {Photographer} from '../../datamodel/photographer';
import {ActivatedRoute, Router} from '@angular/router';
import {PhotographerLoginService} from "../../services/photographer-login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, PhotographerLoginService]
})
export class LoginComponent implements OnInit {

  authCredential: OauthCredential;
  photographer: Photographer;
  loginMsg = '';
  returnUrl = '';

  constructor(private router: Router, private loginService: LoginService, private photographerLoginService: PhotographerLoginService,
              private route: ActivatedRoute) {

  }

  ngOnInit(){
    if(this.photographerLoginService.isLoggedIn()){
      this.router.navigate(['/photographer-panel/locations']);
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private authenticate(emailOrUsername: string, password: string, loginCallBack: LoginCallBack ){

    this.loginService.authenticate(emailOrUsername, password).subscribe(

      result => {
        this.authCredential = result;
        this.loginService.getUserDetailsAndStoreInLocal( this.authCredential.access_token).subscribe(data=>{
          loginCallBack(true, 'Login success', data);
        });
      },
      error => {
        console.log(error);
        loginCallBack(false, error.error.error_description, null);
      });
  }

  public loginBtnClick(emailOrUsername: string, password: string){
    this.authenticate(emailOrUsername, password, ( loginSuccess: boolean,msg: string, photographer: Photographer): void => {
      this.loginMsg = msg;
      if(loginSuccess){
        if(photographer.authorities[0].authority === "ROLE_photographer") {
          if(this.returnUrl !== '/'){
            this.router.navigate([this.returnUrl]);
          }
          else {
            this.router.navigate(['/photographer-panel/locations']);
          }

        }
        else if (photographer.authorities[0].authority === "ROLE_superadmin"){
          this.router.navigateByUrl('/photographer-panel/admin-login');
        }
      }

    });
  }

}

interface LoginCallBack {
  (loginSuccess: boolean, msg: string, data: Photographer): void;
}
