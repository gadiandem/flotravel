import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { insuranceConstant } from '../../insurance.constant';
import { QuoteResponse } from 'src/app/model/insurance/quote/quote.response';
import { InsurancePackageForm } from 'src/app/model/insurance/linsurance-package-form';
import { InsuranceService } from 'src/app/service/insurance/insurance.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-insurance-product',
  templateUrl: './create-insurance-product.component.html',
  styleUrls: ['./create-insurance-product.component.css']
})
export class CreateInsuranceProductComponent implements OnInit {


  formSubmitError: boolean;
  user: UserDetail;
  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  insuranceProduct : QuoteResponse;
  insuranceForm: FormGroup;
  productId: string;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private alertify: AlertifyService,
    private _location: Location,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    ) { }

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
  }

  private initForm() {
    this.insuranceForm = this.fb.group({
      name: ['Flotravel Insurance', Validators.required],
      packagePrice: ['', Validators.required],
      maxDayCount: ['', [Validators.required]],
    });
  }


  createProduct() {
    // console.log(this.insuranceForm.value);
    if (this.insuranceForm.valid) {
      const d: any = this.insuranceForm.value;
      let request = new InsurancePackageForm();
      request = d;

      this.insuranceService.createInsuranceProduct(request).subscribe(
        res => {
          this.alertify.success(`Create succeeful!`);
          this._location.back();
        }, e => {
          this.alertify.error(`${e.message}`);
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

}
