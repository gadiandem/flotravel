import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { EmailExistValidation } from 'src/app/model/wallet/email-validation';
import { AgentNameValidationService } from 'src/app/service/agent-name-validation.service';

@Injectable({
  providedIn: 'root'
})
export class AgentNameExistValidationService {

  constructor(private emailValidationService: AgentNameValidationService) {}

  checkIfAgentNameExists(agentName: string): Observable<boolean> {
    return this.emailValidationService.agentNameValidation(agentName).pipe(
      map((res: EmailExistValidation) => res.existed)
    );
  }

  agentNameExistValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfAgentNameExists(control.value).pipe(
        map(res => {
          console.log(res);
          return res ? { agentNameExist: true } : null;
        })
      );
    };
  }
}