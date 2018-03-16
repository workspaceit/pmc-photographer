import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ResetpasswordService} from "../../services/resetpassword.service";
@Component({
  selector: 'app-reset-password-component',
  templateUrl: './reset-password-component.component.html',
  styleUrls: ['./reset-password-component.component.css']
})
export class ResetPasswordComponentComponent implements OnInit {

  resetPasswordForm: FormGroup;
  sentMail: Boolean;
  msg: string;

  constructor(private resetPasswordService:ResetpasswordService) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
    });
    this.sentMail = false;
  }

  submit(value) {
    const email = value.email;
    this.resetPasswordService.sendResetPasswordToken(email)
      .subscribe((data)=> {
        console.log(data);
        this.sentMail = true ;
        this.msg = 'A mail sent has been sent to your email address';
        this.resetPasswordForm.reset();
      },(error)=> {
        console.log(error);
        this.sentMail = true ;
        this.msg = 'User may not be valid';
      });
  }

}
