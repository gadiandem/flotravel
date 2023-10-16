import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { appConstant } from "src/app/app.constant";

@Component({
  selector: 'app-package-redirect',
  templateUrl: './package-redirect.component.html',
  styleUrls: ['./package-redirect.component.css']
})
export class PackageRedirectComponent implements OnInit, AfterViewChecked {
  @ViewChild('redirectFormRef', { static: true }) redirectFormElement: ElementRef;

  redirect: any;
  redirectForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.redirect = JSON.parse(sessionStorage.getItem(appConstant.REDIRECT));
    this.initForm();
  }

  private initForm() {
    this.redirectForm = this.fb.group({
      MD: [this.redirect.params.MD],
      PaReq: [this.redirect.params.PaReq],
      TermUrl: [this.redirect.params.TermUrl],
    });
  }

  ngAfterViewChecked() {
    this.redirectFormElement.nativeElement.submit();
  }
}
