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
import { FloInsuranceProducts } from 'src/app/model/insurance/flo_insurance_products';

@Component({
  selector: 'app-edit-insurance-products',
  templateUrl: './edit-insurance-products.component.html',
  styleUrls: ['./edit-insurance-products.component.css']
})
export class EditInsuranceProductsComponent implements OnInit {


  formSubmitError: boolean;
  user: UserDetail;
  fetching: boolean;
  errorMessage: string[] = [];
  insuranceProduct : FloInsuranceProducts;
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
    this.fetching = true;
    this.formSubmitError = false;
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.productId = params['packageId'];
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
        JSON.parse(sessionStorage.getItem(insuranceConstant.HISTORY_INSURANCE_SELECTED));
        this.insuranceService.getInsurancePackage(this.productId).subscribe(
            response => {
                this.insuranceProduct = response;
               // console.log(JSON.stringify(this.insuranceProduct));
                this.updateFormData();
                this.fetching = false;
            }
        );

    });
  }

  private initForm() {
    this.insuranceForm = this.fb.group({
      name: ['Flotravel Insurance', Validators.required],
      packagePrice: ['', Validators.required],
      code: ['', [Validators.required]],
      quoteCode: ['', [Validators.required]],
      maxDayCount: ['', [Validators.required]],
      label: ['', [Validators.required]],
      limit: ['', [Validators.required]],
      excess: ['', [Validators.required]],
    });
  }

  updateFormData() {
    this.insuranceForm.patchValue({
      name: this.insuranceProduct.products[0].name,
      quoteCode: this.insuranceProduct.products[0].quoteCode,
      packagePrice: this.insuranceProduct.packagePrice,
      maxDayCount: this.insuranceProduct.maxDayCount,
      code: this.insuranceProduct.products[0].guarantees[0].code,
      label: this.insuranceProduct.products[0].guarantees[0].label,
      limit: this.insuranceProduct.products[0].guarantees[0].limit,
      excess: this.insuranceProduct.products[0].guarantees[0].excess,
    });
  }

  editProduct() {
   // console.log(this.insuranceForm.value);
    if (this.insuranceForm.valid) {
      const d: any = this.insuranceForm.value;
      let request = new InsurancePackageForm();
      request = d;

      this.insuranceService.updateInsuranceProduct(request, this.productId).subscribe(
        res => {
          this.alertify.success(`Update succeeful!`);
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
