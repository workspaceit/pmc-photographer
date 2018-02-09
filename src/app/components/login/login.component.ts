import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../services/login.service';
import {OauthCredential} from '../../datamodel/oauth.creadential';
import {Photographer} from '../../datamodel/photographer';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  authCredential: OauthCredential;
  photographer: Photographer;
  loginErrorMsg = "";
  constructor(private router: Router,private loginService: LoginService) {

  }

  ngOnInit() {

  }



  private authenticate(emailOrUsername: string, password: string, loginCallBack: LoginCallBack ){

    this.loginService.authenticate(emailOrUsername, password).subscribe(

      result => {
        this.authCredential = result;

        this.loginService.getUserDetails(this.authCredential.access_token).subscribe((photographer) => {
          this.photographer = photographer;

          loginCallBack(true,'Login success');
        });
      },
      error => {
        console.log(error);
        loginCallBack(false,error.error.error_description);
      });
  }

  public loginBtnClick(emailOrUsername: string, password: string){
    this.authenticate(emailOrUsername, password, ( loginSuccess: boolean,errorMsg: string): void => {
      this.loginErrorMsg = errorMsg;
      if(loginSuccess){
        this.router.navigateByUrl('/photographer-panel/locations/page/1');
      }

    });
  }

}

interface LoginCallBack {
  (loginSuccess: boolean, errorMsg: string): void;
}
