import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import { Store } from "@ngrx/store";

import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { TransactionHistoryReq } from "src/app/model/wallet/transaction/transaction-history-req";
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from "src/app/service/alertify.service";
@Component({
  selector: 'app-vertual-cards-search',
  templateUrl: './vertual-cards-search.component.html',
  styleUrls: ['./vertual-cards-search.component.css']
})
export class VertualCardsSearchComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  vertualCardListForm: FormGroup;
  hoveredDate: NgbDate | null = null;

  account: UserDetail;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  constructor(private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private dateAdapter: NgbDateAdapter<string>
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev( this.calendar.getToday(), 'm', 1);
    this.initForm();
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if(this.account){
        this.updateFormData();
        this.searchTransactions();
      }
    });
  }

  initForm() {
    this.vertualCardListForm = this.fb.group({
      dateFrom: [""],
      dateTo: [""],
      cardNumber: [""],
      block: [""]
    });
  }

  updateFormData(){
    this.vertualCardListForm.patchValue({
      dateFrom: this.dateAdapter.toModel(this.fromDate),
      dateTo: this.dateAdapter.toModel(this.toDate)
    })
  }

  cancel() {
    this._location.back();
  }

  searchTransactions() {
    if (this.vertualCardListForm.valid) {
      // this.alertify.error('This feature currently not support');
      this.store.dispatch(new WalletActions.VCNListStart({ userId: this.account.id }));
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
