import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {PhotographerLoginService} from './services/photographer-login.service';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {

  constructor(private photographerLoginService: PhotographerLoginService) {}

  canActivate() {
    if (this.photographerLoginService.isLoggedIn()) {
      return true;
    } else {
      window.alert('no permission');
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
