import { EventEmitter, Injectable } from '@angular/core';
// declare let alertify: any;
import * as alertify from 'alertifyjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() { }

  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else { }
    }).setHeader('Flotravel');
  }

  success(message: string) {
    console.log(message);
    alertify.set('notifier', 'position', 'top-right');
    alertify.success(message);
  }

  error(message: string) {
    alertify.set('notifier', 'position', 'top-right');
    alertify.error(message);
  }

  warning(message: string) {
    alertify.set('notifier', 'position', 'top-right');
    alertify.warning(message);
  }

  message(message: string) {
    alertify.set('notifier', 'position', 'top-right');
    alertify.message(message);
  }

  // prompt() {
  //   return alertify;
  // }

  prompt(title: string, valueToChange: string, id: string, okCallback: (valueToChange, id) => any) {
    alertify.prompt(title, valueToChange,
      (evt, value) => {
        valueToChange = value;
        okCallback(valueToChange, id);
        // alertify.success('Ok: ' + value);
      },
      () => {
        alertify.set('notifier', 'position', 'top-right');
        alertify.error('Cancel');
      }).setHeader(title);
  }
}
