import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../../../services/login.service";
import {PhotographerLoginService} from "../../../../services/photographer-login.service";

@Component({
  selector: 'app-top-dock',
  templateUrl: './top-dock.component.html',
  styleUrls: ['./top-dock.component.css'],
  providers: [PhotographerLoginService]
})
export class TopDockComponent implements OnInit {

  constructor(private router: Router, private photographerLoginService: PhotographerLoginService) { }

  ngOnInit() {
  }

  logout() {
    this.photographerLoginService.removeLocalOauthCredential();
    this.photographerLoginService.removeLocalUserDetails();
    this.router.navigate(['/login']);
  }

}
