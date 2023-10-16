import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { LoginForm } from 'src/app/model/auth/login-register/login-form';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';

@Component({
  selector: 'app-login-register-dialogs',
  templateUrl: './login-register-dialog.component.html',
  styleUrls: ['./login-register-dialog.component.css']
})
export class LoginRegisterDialogComponent implements OnInit {
  isLoading = false;
  failure = false;
  loginForm: FormGroup;
  formSubmitError: boolean;
  loginData: LoginForm;
  errorMessage: string;
  user: UserDetail;
  userSave: UserDetail;
  public event: EventEmitter<LoginForm> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isLoading = false;
    this.userSave = new UserDetail();
    this.initForm();
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.failure = authState.failure;
      this.errorMessage = authState.errorMessage || '';
      this.user = authState.user;
      console.log('user from model: ' + JSON.stringify(this.user));
      if (this.user == null) {
        this.userSave = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user != null) {
          this.event.emit(this.userSave);
          this.bsModalRef.hide();
        }
      } else {
        this.event.emit(this.user);
        this.bsModalRef.hide();
      }

    });
    this.loginData = new LoginForm();
    this.formSubmitError = false;
  }

  private initForm() {
    this.loginForm = new FormGroup({
      // tslint:disable-next-line: max-line-length
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)

    });
  }

  closeModal() {
    this.bsModalRef.hide();
  }
  submit() {

    if (this.loginForm.valid) {
      console.log(JSON.stringify(this.loginForm.value));
      const d: any = this.loginForm.value;
      this.loginData.email = d.email;
      this.loginData.password = d.password;
      this.store.dispatch(
        new AuthActions.LoginStart({ email: d.email, password: d.password, callbackUrl: null })
      );

      // this.event.emit(this.loginData);
      // this.bsModalRef.hide();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

}
