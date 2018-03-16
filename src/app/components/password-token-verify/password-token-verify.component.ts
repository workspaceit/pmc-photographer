import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ResetpasswordService} from "../../services/resetpassword.service";

@Component({
  selector: 'app-password-token-verify',
  templateUrl: './password-token-verify.component.html',
  styleUrls: ['./password-token-verify.component.css']
})
export class PasswordTokenVerifyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router,private resetPasswordService:ResetpasswordService) { }
  photographerId: number;
  token: string;
  ngOnInit() {
    this.route.params.subscribe(
      (params)=> {
        this.token = params['token'];
        this.photographerId = params['id'];
        this.resetPasswordService.verifyPasswordToken(this.photographerId,this.token).subscribe(
          (data)=> {
           localStorage.setItem("update-password-user",JSON.stringify(data));
           this.router.navigate(['update-password']);
          }
        );
      }
    );
  }

}
