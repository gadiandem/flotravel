import { Component, OnInit } from '@angular/core';
import * as AuthActions from './../store/auth.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { AlertifyService } from 'src/app/service/alertify.service';
import { NewsletterForm } from 'src/app/model/auth/login-register/newsletter-form';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'auth-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  emailForm: FormGroup;
  loginData: NewsletterForm;
  formSubmitError: boolean;

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService) { }

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
    this.router.navigate(['../auth/newsletter'], { relativeTo: this.activeRoute });
  }

}
