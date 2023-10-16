import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { Airline } from 'src/app/model/flight/airline/airline';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { FlotravelProviderService } from 'src/app/service/admin/provider/flotravel-provider.service';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { PartialFlightReq } from 'src/app/model/flight/partial-flight-req';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';

@Component({
  selector: 'app-edit-partial-flight-admin',
  templateUrl: './edit-partial-flight-admin.component.html',
  styleUrls: ['./edit-partial-flight-admin.component.css']
})
export class EditPartialFlightAdminComponent implements OnInit {
  subscription: Subscription;
  flightForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;

  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];

  flight: FlocashPaymentFlight;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private providerService: FlotravelProviderService,
    private flightHistoryService: FlightBookingHistoryService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (!this.user) {
        this.router.navigate(['/']);
      }
    });
    this.flight = JSON.parse(sessionStorage.getItem('flightBookingDetail'));
    if(this.flight){
        this.fetchPartialFlightDetail();
    }
  }

  initForm() {
    this.flightForm = this.fb.group({
      provider: ['', Validators.required],
      creatdDate: ['', Validators.required],
      id: ['', Validators.required],
      ticket: ['', Validators.required],
      status: ['', Validators.required],
   
    });
  }

  fetchPartialFlightDetail() {
        this.updateFormData();
  }

  updateFormData() {
    this.flightForm.patchValue({
      provider: this.flight.serviceName,
      creatdDate: this.flight.createDate,
      id: this.flight.id,
      status: this.flight.status,
      ticket: this.flight.qrTicketInfo.ticketDocInfo[0].ticketDocument[0].ticketDocNbr
    });
  }

  updateRequest() {
    console.log(this.flightForm.value);
    if (this.flightForm.valid) {
      const d: any = this.flightForm.value;
      const request = new PartialFlightReq();
      request.id = d.id;
      request.provider = 5;
      request.status = d.status
      request.userId = this.user.id
    
      this.flightHistoryService.editPartialFlightBookingList(request).subscribe(
        res => {
          this.alertify.success(`update successful!`);
          this._location.back();
        }, e => {
          if(e.error){
            this.alertify.error(`${e.error.message}`);
          } else {
            this.alertify.error(`${e}`);
          }
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
