import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-user-agent-create",
  templateUrl: "./user-agent-create.component.html",
  styleUrls: ["./user-agent-create.component.css"],
})
export class UserAgentCreateComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  addBankForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
  }

  initForm() {
    this.addBankForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      role: ["", Validators.required],
      status: ["", Validators.required],
    });
  }

  cancel() {
    this._location.back();
  }

  addBank() {
    if (this.addBankForm.valid) {
      // this.route.navigate(["../summary"], { relativeTo: this.activeRoute });
      this._location.back();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
