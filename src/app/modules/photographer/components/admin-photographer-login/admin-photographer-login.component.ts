import { Component, OnInit } from '@angular/core';
import {AdminPhotographerLoginService} from "../../../../services/admin-photographer-login.service";
import {Photographer} from "../../../../datamodel/photographer";
import {Router} from "@angular/router";
import {LoginService} from "../../../../services/login.service";

@Component({
  selector: 'app-admin-photographer-login',
  templateUrl: './admin-photographer-login.component.html',
  styleUrls: ['./admin-photographer-login.component.css'],
  providers: [AdminPhotographerLoginService]
})
export class AdminPhotographerLoginComponent implements OnInit {

  photographers: Photographer[];
  searchTerm = '';

  constructor(private adminPhotographerLoginService: AdminPhotographerLoginService, private router: Router,
              private loginService: LoginService) { }

  ngOnInit() {
    this.getPhotographers();
  }

  getPhotographers() {
    this.adminPhotographerLoginService.getPhotographers().subscribe(
      data => {
        this.photographers = data;
      },
      error => {

      }
    );
  }

  loginAsPhotographer(photographer: Photographer) {
    this.adminPhotographerLoginService.loginAsPhotographer(photographer).subscribe(
      data => {
        this.loginService.getUserDetailsAndStoreInLocal(data.access_token).subscribe(
          photographerData => {
            this.router.navigateByUrl('/photographer-panel/locations');
          },
          error => {

          }
        );
      },
      error => {}
    );
  }



}
