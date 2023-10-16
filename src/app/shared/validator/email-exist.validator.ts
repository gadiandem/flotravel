import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { EmailValidationService } from 'src/app/service/email-validation.service';
import { EmailExistValidation } from 'src/app/model/wallet/email-validation';

@Injectable({
  providedIn: 'root'
})
export class EmailExistValidationService {

  constructor(private emailValidationService: EmailValidationService) {}

  checkIfUsernameExists(email: string): Observable<boolean> {
    // normally, this is where you will connect to your backend for validation lookup
    // using http, we simulate an internet connection by delaying it by a second
    // return of(this.takenUsernames.includes(username)).pipe(delay(1000));
    return this.emailValidationService.emailExistValidation(email).pipe(
      map((res: EmailExistValidation) => res.existed)
    );
  }

  emailExistValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfUsernameExists(control.value).pipe(
        map(res => {
          console.log(res);
          // if res is true, username exists, return true
          return res ? { emailExists: true } : null;
          // NB: Return null if there is no error
        })
      );
    };
  }
}