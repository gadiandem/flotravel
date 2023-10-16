import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LoginService } from '../../service/login/login.service';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from './../store/auth.actions';
import { LoginForm } from '../../model/auth/login-register/login-form';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  failure = false;
  loginForm: FormGroup;
  loginData: LoginForm;
  formSubmitError: boolean;
  dismissible = true;
  return = '';

  errorMessage: string = null;
  previousUrl = '/dashboard';
  constructor( private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>) {
    }

  ngOnInit() {
    this.loginData = new LoginForm();
    this.formSubmitError = false;
    this.initForm();
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.failure = authState.failure;
      this.errorMessage = authState.errorMessage;
      if (this.errorMessage) {
        console.log(this.errorMessage);
      }
    });
  }
  private go() {
    this.router.navigateByUrl(this.return);
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    const d: any = this.loginForm.value;
    this.store.dispatch(
      new AuthActions.LoginStart({ email: d.email, password: d.password, callbackUrl: this.previousUrl })
    );
  }

  signUp() {
    const d: any = this.loginForm.value;
    this.router.navigate(['../register'], { relativeTo: this.activeRoute });
  }

}
