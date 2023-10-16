import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {BankDepositComponent} from './pages';
import {BankDepositResultComponent, BankDepositSummaryComponent, CreditcardInfoComponent, DepositStartComponent, PollsTransactionComponent} from './components';

const routes: Routes = [
  {
    path: '', component: BankDepositComponent,
    children: [
      { path: '', redirectTo: 'start', pathMatch: 'full'},
      { path: 'start', component: DepositStartComponent },
      { path: 'summary', component: BankDepositSummaryComponent },
      { path: 'result', component: BankDepositResultComponent },
      { path: 'card-info', component: CreditcardInfoComponent },
      { path: 'poll-transaction', component: PollsTransactionComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankDepositRoutingModule { }
