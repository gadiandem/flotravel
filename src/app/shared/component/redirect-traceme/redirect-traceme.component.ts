import { Component, Input, OnInit } from '@angular/core';
import { SERVICENAME } from 'src/app/app.constant';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';

@Component({
  selector: 'app-redirect-traceme',
  templateUrl: './redirect-traceme.component.html',
  styleUrls: ['./redirect-traceme.component.css']
})
export class RedirectTracemeComponent implements OnInit {
  @Input() fetching: boolean;
  @Input() fetchFailed: boolean;
  @Input() errorMes: string;
  @Input() currency: string;
  @Input() tracemePaymentRes: FlocashPaymentTraceMe;

  serviceName: string;
  
  constructor() { }

  ngOnInit() {
    this.serviceName = SERVICENAME.TRACEME;
  }

}
