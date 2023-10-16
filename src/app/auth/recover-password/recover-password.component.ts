import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ResetPasswordService } from 'src/app/service/auth/reset-password.service';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {
  resetForm: FormGroup;
  formSubmitError: boolean;
  fetching: boolean;
  failure: boolean;
  invalidToken: boolean;
  dismissible: boolean;
  errorMessage: string;
  forgetRes: any;
  token: string;
  constructor(private fb: FormBuilder, private resetPasswordService: ResetPasswordService,
    private activeRoute: ActivatedRoute) { 
    }

  ngOnInit() {
    this.formSubmitError = false;
    this.fetching = false;
    this.failure = false;
    this.invalidToken = false;
    this.dismissible = true;
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
      this.checkTokenValid(this.token);
    });
  }

  private initForm() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },{ validator: passwordMatcher });
  }

  checkTokenValid(token: string){
    this.resetPasswordService.checkTokenValid(token).subscribe(
      (res: any) => {
        this.fetching = false;
        if(res.valid){
          this.invalidToken = false;
        } else {
          this.invalidToken = true;
          this.errorMessage = "Token already in valid try other reset password request";
        }
      }, e => {
        this.fetching = false;
        this.invalidToken = true;
        this.errorMessage = e.error.message;
      }
    )
  }

  resetPassword() {
    const d: any = this.resetForm.value;
    const email = d.email;
    this.requestResetPassword(email);
  }

  requestResetPassword(email: string) {
    if(this.resetForm.valid){
      const d: any = this.resetForm.value;
      this.fetching = true;
      this.failure = false;
      const request = {
        newPassword: d.password,
        confirmPassword: d.confirmPassword,
        token: this.token,
      }
      this.resetPasswordService.resetPassword(request).subscribe(
        (res: any) => {
          this.fetching = false;
          this.failure = false;
          this.forgetRes = res;
          console.log(res);
        }, e => {
          console.log(e);
          this.fetching = false;
          this.failure = true;
          this.errorMessage = e.error.message;
        }
      )
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
