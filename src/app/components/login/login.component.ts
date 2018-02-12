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
  loginMsg = "";
  constructor(private router: Router,private loginService: LoginService) {

  }

  ngOnInit() {

  }



  private authenticate(emailOrUsername: string, password: string, loginCallBack: LoginCallBack ){

    this.loginService.authenticate(emailOrUsername, password).subscribe(

      result => {
        this.authCredential = result;
        this.loginService.getUserDetailsAndStoreInLocal( this.authCredential.access_token).subscribe(data=>{
          loginCallBack(true, 'Login success');
        });
      },
      error => {
        console.log(error);
        loginCallBack(false, error.error.error_description);
      });
  }

  public loginBtnClick(emailOrUsername: string, password: string){
    this.authenticate(emailOrUsername, password, ( loginSuccess: boolean,msg: string): void => {
      this.loginMsg = msg;
      if(loginSuccess){
        console.log(this.loginService.getLocalUserDetails());
        console.log(this.loginService.getLocalOauthCredential());
        //this.router.navigateByUrl('/photographer-panel/locations/page/1');
      }

    });
  }

}

interface LoginCallBack {
  (loginSuccess: boolean, msg: string): void;
}
