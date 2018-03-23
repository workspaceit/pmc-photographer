import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "./services/login.service";
import {PhotographerLoginService} from "./services/photographer-login.service";

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {

  constructor(private photographerLoginService: PhotographerLoginService, private router: Router) {}

  canActivate() {
    if (this.photographerLoginService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable()
export class UpdatePasswordGuard implements CanActivate {

  constructor() {}

  canActivate() {
    const user = localStorage.getItem("update-password-user");
    if (user) {
      return true;
    } else {
      window.alert('no permission');
      return false;
    }
  }
}
