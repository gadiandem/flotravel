import { Action } from '@ngrx/store';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { LoginForm } from 'src/app/model/auth/login-register/login-form';
import { RegisterForm } from 'src/app/model/auth/login-register/register-form';

export const LOGIN_START = '[Auth] LOGIN START';
export const NEWSLETTER_START = '[Auth]  NEWSLETTER START';
export const NEWSLETTER_RESPONSE = '[Auth] NEWSLETTER RESPONSE';
export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN_SUCCESS';
export const AUTHENTICATE_FAIL = '[Auth] LOGIN FAIL';
export const REGISTER_START = '[Auth] REGISTER START';
export const REGISTER_SUCCESS = '[Auth] REGISTER';
export const REGISTER_FAIL = '[Auth] REGISTER FAIL';
export const LOGOUT = '[Auth] LOGOUT';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string; callbackUrl: string; }) { }
}
export class NewsletterStart implements Action {
  readonly type = NEWSLETTER_START;

  constructor(public payload: { email: string;  }) { }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) { }
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      user: UserDetail;
      redirect: boolean;
      callbackUrl: string;
    }
  ) { }
}

export class NewsletterResponse implements Action {
  readonly type = NEWSLETTER_RESPONSE;

  constructor(
    public payload: string){
    }
}

export class RegisterStart implements Action {
  readonly type = REGISTER_START;

  constructor(public payload: { registerForm: RegisterForm }) { }
}

export class RegisterFail implements Action {
  readonly type = REGISTER_FAIL;

  constructor(public payload: string) { }
}

export class RegisterSuccess implements Action {
  readonly type = REGISTER_SUCCESS;

  constructor(
    public payload: {
      user: UserDetail
    }
  ) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
  constructor(public payload: string) { }
}

export type AuthActions =
  | LoginStart
  | NewsletterStart
  | NewsletterResponse
  | Logout
  | AuthenticateFail
  | AuthenticateSuccess
  | RegisterStart
  | RegisterSuccess
  | RegisterFail;
