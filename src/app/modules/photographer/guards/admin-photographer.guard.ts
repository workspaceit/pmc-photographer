import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {PhotographerLoginService} from "../../../services/photographer-login.service";

@Injectable()
export class AdminPhotographerGuard implements CanActivate {

  constructor(private photographerLoginService: PhotographerLoginService) {}

  canActivate() {
    return this.photographerLoginService.getLocalUserDetails().authorities[0].authority === "ROLE_superadmin";
  }
}
