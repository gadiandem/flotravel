import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { NewsletterComponent } from './newsletter-subscribe/newsletter-subscribe';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgetPassword', component: ForgetPasswordComponent },
      { path: 'recoverPassword/:token', component: RecoverPasswordComponent },
      { path: 'newsletter', component: NewsletterComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
