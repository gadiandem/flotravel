import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared/share.module';

import { TransactionsHistoryRoutingModule } from './transactions-history-routing.module';
import { TransactionsHistoryComponent } from './transactions-history.component';
import { TransHeaderComponent } from './trans-header/trans-header.component';
import { TransFooterComponent } from './trans-footer/trans-footer.component';
import { HotelTransactionsComponent } from './hotel-transactions/hotel-transactions.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { HotelHistoryDetailComponent } from './hotel-transactions/hotel-transaction-detail/hotel-transaction-detail.component';
import { FlightTransactionsComponent } from './flight-transactions/flight-transactions.component';
import { FlightHistoryDetailComponent } from './flight-transactions/flight-transaction-detail/flight-transaction-detail.component';
import { PackageTransactionsComponent } from './package-transactions/package-transactions.component';
import { PackageTransactionDetailComponent } from './package-transactions/package-transaction-detail/package-transaction-detail.component';
import { InsuranceTransactionsComponent } from './insurance-transactions/insurance-transactions.component';
import { InsuranceTransactionDetailComponent } from './insurance-transactions/insurance-transaction-detail/insurance-transaction-detail.component';
import { TraceMeTransactionsComponent } from './trace-me-transactions/trace-me-transactions.component';
import { HepstarTransactionsComponent } from './hepstar-transactions/hepstar-transactions.component';
import { HepstarTransactionDetailComponent } from './hepstar-transactions/hepstar-transaction-detail/hepstar-transaction-detail.component';
import { GacTransactionsComponent } from './gac-transactions/gac-transactions.component';
import { GacTransactionsDetailsComponent } from './gac-transactions/gac-transactions-details/gac-transactions-details.component';
import { SpecialPackagesComponent } from './special-packages/special-packages.component';
import { SpecialPackagesTransactionDetailComponent } from './special-packages/special-packages-transaction-detail/special-packages-transaction-detail.component';
import { TracemeTransactionDetailComponent } from './trace-me-transactions/traceme-transaction-detail/traceme-transaction-detail.component';
import { FlotravelTransactionComponent } from './flotravel-transaction/flotravel-transaction.component';



@NgModule({
  declarations: [
    TransactionsHistoryComponent,
     TransHeaderComponent,
     TransFooterComponent,
     HotelTransactionsComponent,
     HotelHistoryDetailComponent,
     FlightTransactionsComponent,
     FlightHistoryDetailComponent,
     PackageTransactionsComponent,
     PackageTransactionDetailComponent,
     InsuranceTransactionsComponent,
     InsuranceTransactionDetailComponent,
     TraceMeTransactionsComponent,
     HepstarTransactionsComponent,
     HepstarTransactionDetailComponent,
     GacTransactionsComponent,
     GacTransactionsDetailsComponent,
     SpecialPackagesComponent,
     SpecialPackagesTransactionDetailComponent,
     TracemeTransactionDetailComponent,
     FlotravelTransactionComponent

    ],

  imports: [
    FormsModule,
    // ReactiveFormsModule,
    SharedModule,
    GridModule,
    CommonModule,
    TransactionsHistoryRoutingModule,
    NgSelect2Module,
    NgxSkeletonLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class TransactionsHistoryModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
