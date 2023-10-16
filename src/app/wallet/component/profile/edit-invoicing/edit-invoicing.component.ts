import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";

import { UserInfo } from "src/app/model/wallet/profile/user-info";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertifyService } from "src/app/service/alertify.service";

@Component({
  selector: 'app-edit-invoicing',
  templateUrl: './edit-invoicing.component.html',
  styleUrls: ['./edit-invoicing.component.css']
})
export class EditInvoicingComponent implements OnInit {
  isCollapsed: boolean;

  @Output() editMode = new EventEmitter<boolean>();
  @Input() accountInfo: UserInfo;

  invoicingSettingForm: FormGroup;
  formSubmitError: boolean;
  constructor(private alertify: AlertifyService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.invoicingSettingForm = this.fb.group({
      taxId: ["", Validators.required],
      term: ["", Validators.required],
    });
  }

  updateSetting() {
    if (this.invoicingSettingForm.valid) {
      this.alertify.warning("This feature currently not available");
      this.closeEditMode();
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  closeEditMode() {
    this.editMode.emit(true);
  }
}
