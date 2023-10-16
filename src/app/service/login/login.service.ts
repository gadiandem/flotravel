import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/model/auth/user/user';
import {UserDetail} from '../../model/auth/user/user-detail';
import {appConstant} from '../../app.constant';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginsUrl = environment.baseUrl + 'auth/login';

  user = new BehaviorSubject<User>(null);
  isAuth: boolean;
  loadedUser = new User();
  account: UserDetail;

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post<User>(this.loginsUrl, {
      email: email,
      password: password
    });
  }

  checkAuth() {
    this.loadedUser = JSON.parse(sessionStorage.getItem('user'));
    if (this.user != undefined) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
    this.user.next(this.loadedUser);
  }

  get authenticated() {
    this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (this.account) {
      return true;
    } else {
      return false;
    }
  }

}
