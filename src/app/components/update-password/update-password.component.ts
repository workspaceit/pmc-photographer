import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormGroup, FormControl, Validators } from '@angular/forms';
import {ResetpasswordService} from "../../services/resetpassword.service";

function passwordConfirming(c: AbstractControl): any {
  if(!c.parent || !c) { return; }
  const pwd = c.parent.get('password');
  const cpwd= c.parent.get('confirmPassword');

  if(!pwd || !cpwd) { return ; }
  if (pwd.value !== cpwd.value) {
    return { invalid: true };

  }
}
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  updatePasswordForm: FormGroup;
  updateMsg: string ;
  done:Boolean;

  constructor(private resetPasswordService:ResetpasswordService) { }

  ngOnInit() {
    this.updatePasswordForm = new FormGroup({
      password:new FormControl('',[Validators.required]),
      confirmPassword:new FormControl('',[Validators.required,passwordConfirming]),
    });
    this.done = false;
  }

  submit(value) {
    const user = JSON.parse(localStorage.getItem("update-password-user"));
    const photographerId = user.id;
    this.resetPasswordService.updatePassword(photographerId,value.password)
      .subscribe((data)=> {
        this.done = true;
        this.updateMsg = 'Password has been updated';
        this.updatePasswordForm.reset();
        localStorage.removeItem("update-password-user");
      });
  }

}

