import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { Store } from '@ngrx/store';

import { UserInfo } from "src/app/model/wallet/profile/user-info";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertifyService } from "src/app/service/alertify.service";
import { UserProfileService } from "src/app/service/wallet/user-profile.service";
import { UserProfileRes } from "src/app/model/wallet/profile/user-profile-res";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import * as fromApp from 'src/app/store/app.reducer';
import { appConstant } from "src/app/app.constant";
import { UserProfile } from "src/app/model/wallet/profile/user-profile";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-edit-contract",
  templateUrl: "./edit-contract.component.html",
  styleUrls: ["./edit-contract.component.css"],
})
export class EditContractComponent implements OnInit, OnDestroy {
  isCollapsed: boolean;

  @Output() editMode = new EventEmitter<boolean>();

  account: UserDetail;
  userProfile: UserProfileRes;
  editProfileForm: FormGroup;
  formSubmitError: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoadData = true;

  getProfileSub: Subscription;
  updateProfileSub: Subscription;
  constructor(
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.initForm();
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
      this.refreshData();
    });
  }

  refreshData() {
    if (this.initialLoadData) {
      if (this.account) {
        this.fetUserProfile();
      }
    }
    this.initialLoadData = false;
  }

  fetUserProfile() {
    this.getProfileSub = this.userProfileService.fetchUserProfile(this.account.id)
      .subscribe((res: UserProfileRes) => {
        if(res.profile){
          this.updateFormData(res.profile);
        } else {
          this.alertify.error(`${res.errorId} - ${res.errorCode} - ${res.errorMessage}`)
        }
      }, e => {
        this.alertify.error(`${e.error}`)
      }
    );
  }
  initForm() {
    this.editProfileForm = this.fb.group({
      address: ["", Validators.required],
      city: ["", Validators.required],
      postalCode: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      currency: ["", Validators.required],
      language: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      state: ["", Validators.required],
      country: ["", Validators.required],
      accountType: ["", Validators.required],
      businessName: ["", Validators.required],
    });
  }

  updateFormData(profile: UserProfile) {
    this.editProfileForm = this.fb.group({
      currency: [profile.currency || "", Validators.required],
      address: [profile.address || "", Validators.required],
      country: [profile.country || "", Validators.required],
      state: [profile.state, Validators.required],
      city: [profile.city || "", Validators.required],
      postalCode: [profile.postalCode || "", Validators.required],
      email: [profile.email || "", Validators.required],
      language: [profile.language || "", Validators.required],
      phoneNumber: [profile.phoneNumber || "", Validators.required],
      accountType: [profile.accountType || "", Validators.required],
      businessName: [profile.businessName || "", Validators.required],
    });
  }

  updateSetting() {
    if (this.editProfileForm.valid) {
      // this.alertify.warning("This feature currently not available");
      const d = this.editProfileForm.value;
      const userUpdateProfile = new UserProfile();
      userUpdateProfile.address = d.address;
      userUpdateProfile.city = d.city;
      userUpdateProfile.postalCode = d.postalCode;
      userUpdateProfile.phoneNumber = d.phoneNumber;
      userUpdateProfile.currency = d.currency;
      userUpdateProfile.email = d.email;
      userUpdateProfile.state = d.state;
      userUpdateProfile.country = d.country;
      userUpdateProfile.language = d.language;
      userUpdateProfile.accountType = d.accountType;
      userUpdateProfile.businessName = d.businessName;

      this.updateProfileSub = this.userProfileService.updateUserProfile(userUpdateProfile, this.account.id).subscribe(
        (res: UserProfileRes) => {
          if(res.profile){
            this.alertify.success(`Update user Profile successful!`)
          } else {
            this.alertify.error(`${res.errorId} - ${res.errorCode} - ${res.errorMessage}`)
          }
        }, e => {
          this.alertify.error(`${e.error}`)
        }, () => {
          this.closeEditMode();
        }
      )
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  closeEditMode() {
    this.editMode.emit(true);
  }

  ngOnDestroy(): void {
    if(this.getProfileSub){
      this.getProfileSub.unsubscribe();
    }
    if(this.updateProfileSub){
      this.updateProfileSub.unsubscribe();
    }
  }
}
