import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
@Component({
  selector: 'app-verify-card',
  templateUrl: './verify-card.component.html',
  styleUrls: ['./verify-card.component.css']
})
export class VerifyCardComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  verifyCardForm: FormGroup;
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
    this.verifyCardForm = this.fb.group({
      authCode: ["", Validators.required]
    });
  }

  cancel() {
    this._location.back();
  }

  verifyCard() {
    if (this.verifyCardForm.valid) {
      // this.route.navigate(["../summary"], { relativeTo: this.activeRoute });
      this._location.back();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
