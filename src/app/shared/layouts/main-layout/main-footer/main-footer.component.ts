import { Component, OnInit } from '@angular/core';
import * as AuthActions from '../../../../auth/store/auth.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import * as fromApp from '../../../../store/app.reducer';
import { AlertifyService } from 'src/app/service/alertify.service';
import { NewsletterForm } from 'src/app/model/auth/login-register/newsletter-form';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit {

  emailForm: FormGroup;
  loginData: NewsletterForm;
  formSubmitError: boolean;

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService, public translate: TranslateService) {
      translate.setDefaultLang ('en');
      translate.use('en');;
     }

  ngOnInit() {
    this.loginData = new NewsletterForm();
    this.formSubmitError = false;
    this.initForm();
  }

  private initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }


  subscribe() {
    const d: any = this.emailForm.value;
    this.store.dispatch(
      new AuthActions.NewsletterStart({ email: d.email }) 
    );
    this.router.navigate(["/auth/newsletter"], { relativeTo: this.activeRoute });
  }

}
