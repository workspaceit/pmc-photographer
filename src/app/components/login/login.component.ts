import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../services/login.service';
import {OauthCredential} from '../../datamodel/oauth.creadential';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  authCredential: OauthCredential;
  constructor(private loginService: LoginService) {

  }

  ngOnInit() {
    this.loginService.authenticate("user@user.com","123456").subscribe(

        result => {
          this.authCredential = result;
          console.log(this.authCredential);
          /*this.loginService.getUserDetails(this.authCredential.access_token).subscribe((photographer)=>{
            console.log(photographer);
          });*/
          console.log(result);
        },
      error => {
        console.log(error);
      });
  }

}
