import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {appConstant} from 'src/app/app.constant';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {PolicyHolderUpdate} from 'src/app/model/insurance/policy/policy-holder-update';
import {AlertifyService} from 'src/app/service/alertify.service';
import {InsuranceService} from 'src/app/service/insurance/insurance.service';

@Component({
  selector: 'app-insurance-update',
  templateUrl: './insurance-update.component.html',
  styleUrls: ['./insurance-update.component.css']
})
export class InsuranceUpdateComponent implements OnInit {

  policyHolderForm: FormGroup;
  policyHolder: PolicyHolderUpdate;
  policyId: string;
  user: UserDetail;
  isLoading = false;
  formSubmitError: boolean;

  firstNamePattern = '^FLOCASH TEST UPDATED_[0-9]{0,6}$';
  lastNamePattern = '^ETHIOPIAN AIRLINES TEST UPDATED_[0-9]{0,6}$';
  streetAddressPattern = '^123 Test Street UPDATED_[0-9]{0,6}$';
  cityPattern = '^TEST CITY UPDATED_[0-9]{0,6}$';

  constructor(private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private alertify: AlertifyService,
              private insuranceService: InsuranceService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.formSubmitError = false;
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.policyId = params['policyId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.insuranceService.getUpdatePilicyHolderInfo(this.policyId)
          .subscribe(
            (res: PolicyHolderUpdate) => {
              this.isLoading = false;
              this.policyHolder = res;
              if (res) {
                this.updateFormWithData();
              }
            }, e => {
              console.log(e);
            }
          );
      } else {
        this.router.navigate(['/login']);
      }

    });
  }


  private initForm() {
    this.policyHolderForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(this.firstNamePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.lastNamePattern)]],
      streetAddress: ['', [Validators.required, Validators.pattern(this.streetAddressPattern)]],
      city: ['', [Validators.required, Validators.pattern(this.cityPattern)]],
    });
  }

  updateFormWithData() {
    this.policyHolderForm.patchValue({
      firstName: this.policyHolder.firstName,
      lastName: this.policyHolder.lastName,
      streetAddress: this.policyHolder.streetAddress,
      city: this.policyHolder.city,
    });
  }

  updatePolicyHolder() {
    if (this.policyHolderForm.valid) {
      const d: any = this.policyHolderForm.value;
      const policyHolderUpdate = new PolicyHolderUpdate();
      policyHolderUpdate.firstName = d.firstName;
      policyHolderUpdate.lastName = d.lastName;
      policyHolderUpdate.streetAddress = d.streetAddress;
      policyHolderUpdate.city = d.city;
      console.log(policyHolderUpdate);
      this.insuranceService.updatePilicyHolderInfo(policyHolderUpdate, this.policyId).subscribe(
        (res: boolean) => {
          this.alertify.success('Update holder info successful!');
          this.router.navigate(['../../'], { relativeTo: this.activeRoute });
        }, e => {
          this.alertify.error('Update holder info fail!');
          console.log(e);
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
