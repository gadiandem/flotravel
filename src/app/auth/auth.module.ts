import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/share.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { NewsletterComponent } from './newsletter-subscribe/newsletter-subscribe';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    NewsletterComponent,
    ForgetPasswordComponent,
    RecoverPasswordComponent,
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [],
  providers: [],
})
export class AuthModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}