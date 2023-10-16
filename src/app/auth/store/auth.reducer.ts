import * as AuthActions from './auth.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';

export interface State {
  user: UserDetail;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
  callbackUrl: string;
}

const initialState: State = {
  user: JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO)),
  errorMessage: null,
  loading: false,
  failure: false,
  callbackUrl: null
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
      return {
        ...state,
        loading: true,
        failure: false
      };
    case AuthActions.NEWSLETTER_START:
      return {
        ...state,
        loading: true,
        failure: false
      };
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = action.payload.user;
      return {
        ...state,
        user,
        errorMessage: null,
        loading: false,
        failure: false,
        callbackUrl: action.payload.callbackUrl
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        errorMessage: action.payload,
        loading: false,
        failure: true
      };
    case AuthActions.REGISTER_START:
      return {
        ...state,
        loading: true,
        failure: false
      };
    case AuthActions.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        failure: false
      };
    case AuthActions.REGISTER_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        errorMessage: null,
        loading: false,
        failure: false
      };
    default:
      return state;
  }
}
