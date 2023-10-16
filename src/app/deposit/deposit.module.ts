import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PAGES} from './pages';
import {BankDepositRoutingModule} from './bank-deposit-routing.module';
import {COMPONENTS} from './components';
import {SharedModule} from 'src/app/shared/share.module';
import { PollsTransactionComponent } from './components/polls-transaction/polls-transaction.component';

@NgModule({
  declarations: [...PAGES,
    ...COMPONENTS,
    PollsTransactionComponent],
  imports: [
    CommonModule,
    BankDepositRoutingModule,
    SharedModule
  ],
  exports: [
    ...PAGES,
    ...COMPONENTS
  ]
})
export class DepositModule {
}
