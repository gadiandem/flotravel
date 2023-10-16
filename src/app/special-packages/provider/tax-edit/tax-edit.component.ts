import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";

import { AlertifyService } from "src/app/service/alertify.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { TaxPackage } from "src/app/model/packages/provider/tax-package";

@Component({
  selector: 'app-tax-edit',
  templateUrl: './tax-edit.component.html',
  styleUrls: ['./tax-edit.component.css']
})
export class TaxEditComponent implements OnInit {
  taxForm: FormGroup;
  formSubmitError: boolean;
  taxPackageId: string;
  taxPackageDetail: TaxPackage;

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.taxPackageId = params["taxId"];
      // this.isLoading = true;
      this.loadPackageTaxDetail();
    });
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

  loadPackageTaxDetail() {
    this.providerService.getPackageTaxDetail(this.taxPackageId).subscribe(
      (res: TaxPackage) => {
        this.taxPackageDetail = res;
        // this.currency = res.currency;
        // this.isLoading = false;
        this.updateFormWithData();
      },
      (e) => {
        // this.isLoading = false;
      }
    );
  }

  private updateFormWithData() {
    this.taxForm.patchValue({
      name: this.taxPackageDetail.name,
      description: this.taxPackageDetail.description,
      shortDescription: this.taxPackageDetail.shortDescription,
      currency: this.taxPackageDetail.currency,
      price: this.taxPackageDetail.amount,
      note: this.taxPackageDetail.note
    });
  }


  updateTax() {
    if (this.taxForm.valid) {
      const packageTour: TaxPackage = new TaxPackage();
      const d: any = this.taxForm.value;
      packageTour.name = d.name;
      packageTour.description = d.description;
      packageTour.shortDescription = d.shortDescription;
      packageTour.currency = d.currency;
      packageTour.amount = d.price;
      packageTour.note = d.note;

      this.providerService.updatePackageTax(packageTour, this.taxPackageId).subscribe(
        (res: TaxPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update ${res.name} create succeeful!`);
          this._location.back();
        },
        (e) => {
          this.alertify.error(`Update ${packageTour.name} error!. ${e}`);
        }
      );
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
