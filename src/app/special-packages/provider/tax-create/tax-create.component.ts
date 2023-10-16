import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { TaxPackage } from 'src/app/model/packages/provider/tax-package';
@Component({
  selector: 'app-tax-create',
  templateUrl: './tax-create.component.html',
  styleUrls: ['./tax-create.component.css']
})
export class TaxCreateComponent implements OnInit {
  taxForm: FormGroup;
  formSubmitError: boolean;

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
  }
  private initForm() {
    this.taxForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      shortDescription: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }

  createTax() {
    if (this.taxForm.valid) {
      const packageTax: TaxPackage = new TaxPackage();
      const d: any = this.taxForm.value;
      packageTax.name = d.name;
      packageTax.description = d.description;
      packageTax.shortDescription = d.shortDescription;
      packageTax.currency = d.currency;
      packageTax.amount = d.price;
      packageTax.note = d.note;

      this.providerService.createPackageTax(packageTax).subscribe(
        (res: TaxPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create ${res.name} create succeeful!`);
          this._location.back();
        },
        (e) => {
          this.alertify.error(`Create ${packageTax.name} error!. ${e}`);
        }
      );
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
