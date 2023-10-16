import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EmailExistValidation } from '../model/wallet/email-validation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {

  checkEmailExistUrl = environment.baseUrl + 'wallet/validationEmail';

  constructor(private http: HttpClient) { }

  emailExistValidation(email: string) {
    const params = new HttpParams()
    .set("email", email);

    return this.http.get<EmailExistValidation>(`${this.checkEmailExistUrl}`, { params });
  }

}
