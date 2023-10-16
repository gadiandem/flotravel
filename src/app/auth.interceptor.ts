import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from './model/auth/user/user-detail';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromApp from './store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  accountInfo: UserDetail;
  constructor(private store: Store<fromApp.AppState>) {
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.accountInfo = user;
      });
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.accountInfo) {
      request = request.clone({
        setHeaders: {
          'user-id': `${this.accountInfo.id}`,
        }
      });
    }
    return next.handle(request);
  }
}
