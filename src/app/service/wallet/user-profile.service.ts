import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { UserProfileRes } from 'src/app/model/wallet/profile/user-profile-res';
import { UserProfile } from 'src/app/model/wallet/profile/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  userProfilelUrl = environment.baseUrl + 'wallet/profile/user';

  constructor(
    private http: HttpClient,
  ) {}

  fetchUserProfile(userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.get<UserProfileRes>(
      this.userProfilelUrl, { headers }
    );
  }

  updateUserProfile(request: UserProfile, userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.put<UserProfileRes>(
      this.userProfilelUrl, request, { headers }
    );
  }


  addUserIdHeader(userId: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('user-id', `${userId}`);
    return headers;
  }
}
