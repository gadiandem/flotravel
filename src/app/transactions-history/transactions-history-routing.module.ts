import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightHistoryDetailComponent } from './flight-transactions/flight-transaction-detail/flight-transaction-detail.component';
import { FlightTransactionsComponent } from './flight-transactions/flight-transactions.component';
import { GacTransactionsDetailsComponent } from './gac-transactions/gac-transactions-details/gac-transactions-details.component';
import { GacTransactionsComponent } from './gac-transactions/gac-transactions.component';
import { HepstarTransactionDetailComponent } from './hepstar-transactions/hepstar-transaction-detail/hepstar-transaction-detail.component';
import { HepstarTransactionsComponent } from './hepstar-transactions/hepstar-transactions.component';
import { HotelHistoryDetailComponent } from './hotel-transactions/hotel-transaction-detail/hotel-transaction-detail.component';
import { HotelTransactionsComponent } from './hotel-transactions/hotel-transactions.component';
import { InsuranceTransactionDetailComponent } from './insurance-transactions/insurance-transaction-detail/insurance-transaction-detail.component';
import { InsuranceTransactionsComponent } from './insurance-transactions/insurance-transactions.component';
import { PackageTransactionDetailComponent } from './package-transactions/package-transaction-detail/package-transaction-detail.component';
import { PackageTransactionsComponent } from './package-transactions/package-transactions.component';
import { TransactionsHistoryComponent } from './transactions-history.component';
import { SpecialPackagesComponent } from './special-packages/special-packages.component';
import { SpecialPackagesTransactionDetailComponent } from './special-packages/special-packages-transaction-detail/special-packages-transaction-detail.component';
import { TraceMeTransactionsComponent } from './trace-me-transactions/trace-me-transactions.component';
import { TracemeTransactionDetailComponent } from './trace-me-transactions/traceme-transaction-detail/traceme-transaction-detail.component';
import {FlotravelTransactionComponent} from './flotravel-transaction/flotravel-transaction.component';


const routes: Routes = [
  {
    path: '', component: TransactionsHistoryComponent,
    children: [
      { path: '', redirectTo: 'transactions', pathMatch: 'full' },
      { path: 'flotravel-transactions', component: FlotravelTransactionComponent },
      { path: 'hotel-transactions', component: HotelTransactionsComponent },
      { path: 'hotel-transactions/:bookingId', component: HotelHistoryDetailComponent },
      { path: 'flight-transactions', component: FlightTransactionsComponent },
      { path: 'flight-transactions/:bookingId', component: FlightHistoryDetailComponent },
      { path: 'package-transactions', component: PackageTransactionsComponent },
      { path: 'package-transactions/:bookingId', component: PackageTransactionDetailComponent },
      { path: 'deals-transactions', component: SpecialPackagesComponent },
      { path: 'deals-transactions/:bookingId', component: SpecialPackagesTransactionDetailComponent },
      { path: 'insurance-transactions', component: InsuranceTransactionsComponent },
      { path: 'insurance-transactions/:insuranceId', component: InsuranceTransactionDetailComponent },
      { path: 'hepstar-transactions', component: HepstarTransactionsComponent },
      { path: 'hepstar-transactions/:orderId', component: HepstarTransactionDetailComponent },
      { path: 'gac-transactions', component: GacTransactionsComponent },
      { path: 'gac-transactions/:orderId', component: GacTransactionsDetailsComponent },
      { path: 'traceme-transactions', component: TraceMeTransactionsComponent },
      { path: 'traceme-transactions/:orderId', component: TracemeTransactionDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class TransactionsHistoryRoutingModule { }
