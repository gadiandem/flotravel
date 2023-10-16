import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/model/auth/user/user';
import { UserDetail } from './../../model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';

const handleAuthentication = (user: UserDetail, callbackUrl: string) => {
  localStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    user,
    redirect: true,
    callbackUrl,
  });
};

const handleNewsletterSubscription = (serverResponse: string) => {
  return new AuthActions.NewsletterResponse(serverResponse);
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error) {
    // errorMessage = (errorRes.error.message as string).split('-')[1] || errorRes.error.message;
    errorMessage = errorRes.error.message;
  } else {
    errorMessage = errorRes.message;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

const handleRegisterSuccess = (user: User) => {
  console.log('!!!user Register: ' + JSON.stringify(user));
  const userSave = new UserDetail();
  userSave.email = user.email;
  userSave.password = user.password;
  userSave.id = user.id;
  localStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(userSave));
  return new AuthActions.LoginStart({
    email: user.email,
    password: user.password,
    callbackUrl: null,
  });
};

const handleRegisterFailure = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (errorRes != null) {
    return of(new AuthActions.RegisterFail(errorMessage));
  }
  switch (errorRes) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(new AuthActions.RegisterFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  private loginsUrl = environment.baseUrl + 'auth/login';
  private newsletterUrl = environment.baseUrl + 'subscribe/newsletter';
  private registerUrl = environment.baseUrl + 'auth/register';

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post(this.loginsUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
        })
        .pipe(
          map((res: UserDetail) => {
            return handleAuthentication(res, authData.payload.callbackUrl);
          }),
          catchError((errorRes) => {
            console.log('login error:', errorRes);
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authNewsletter = this.actions$.pipe(
    ofType(AuthActions.NEWSLETTER_START),
    switchMap((authData: AuthActions.NewsletterStart) => {
      return this.http
        .post(this.newsletterUrl, {
          email: authData.payload.email,
        })
        .pipe(
          map((res: string) => {
            return handleNewsletterSubscription(res);
          }),
          catchError((errorRes) => {
            console.log('Newsletter error:', errorRes);
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        if (authSuccessAction.payload.callbackUrl) {
          // sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(authSuccessAction.payload.user));
          this.router.navigate([authSuccessAction.payload.callbackUrl]);
        }
        // return;
      }
    })
  );

  // @Effect()
  // authRegister = this.actions$.pipe(
  //   ofType(AuthActions.REGISTER_START),
  //   switchMap((data: AuthActions.RegisterStart) => {
  //     return this.http.post(this.registerUrl, {
  //       email: data.payload.registerForm.email,
  //       password: data.payload.registerForm.password,
  //       confirmPassword: data.payload.registerForm.confirmPassword
  //     })
  //       .pipe(
  //         map((res: User) => {
  //           if (res != null) {
  //             return handleRegisterSuccess(
  //               res
  //             );
  //           } else {
  //             return handleRegisterFailure(res);
  //           }
  //         }),
  //         catchError(errorRes => {
  //           return handleError(errorRes);
  //         })
  //       );
  //   })
  // );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap((data: AuthActions.Logout) => {
      localStorage.removeItem(appConstant.ACCOUNT_INFO);
      sessionStorage.clear();
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}
}
