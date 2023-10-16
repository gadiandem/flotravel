import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from 'src/app/service/auth/reset-password.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  formSubmitError: boolean;
  fetching: boolean;
  failure: boolean;
  dismissible: boolean;
  errorMessage: string;
  forgetRes: any;
  constructor(private fb: FormBuilder, private resetPasswordService: ResetPasswordService) { 
  }

  ngOnInit() {
    this.formSubmitError = false;
    this.fetching = false;
    this.failure = false;
    this.dismissible = true;
    this.initForm();
  }

  private initForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  forgetPassword() {
    const d: any = this.resetForm.value;
    const email = d.email;
    this.requestResetPassword(email);
  }

  requestResetPassword(email: string) {
    if(this.resetForm.valid){
      const d: any = this.resetForm.value;
      this.fetching = true;
      this.failure = false;
      this.resetPasswordService.forgetPassword(d.email).subscribe(
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
