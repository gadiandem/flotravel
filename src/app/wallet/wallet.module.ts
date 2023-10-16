import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { SharedModule } from '../shared/share.module';
import { WalletRoutingModule } from './wallet-routing.module';
import { AgentSummaryComponent } from './agent-summary/agent-summary.component';
import { BalanceComponent } from './component/balance/balance.component';
import { DepositLimitComponent } from './component/deposit-limit/deposit-limit.component';
import { MyDetailsComponent } from './component/my-details/my-details.component';
import { QuickLinksComponent } from './component/quick-links/quick-links.component';
import { AccountInfoComponent } from './component/agent-summary/account-info/account-info.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { WithdrawMoneyComponent } from './withdraw-money/withdraw-money.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { VertualCardComponent } from './vertual-card/vertual-card.component';
import { CompletedTransactionsComponent } from './completed-transactions/completed-transactions.component';
import { ProfileComponent } from './profile/profile.component';
import { UserAgentComponent } from './user-agent/user-agent.component';
import { DepositStepOneComponent } from './component/deposit/deposit-step-one/deposit-step-one.component';
import { DepositStepTwoComponent } from './component/deposit/deposit-step-two/deposit-step-two.component';
import { DepositStepThreeComponent } from './component/deposit/deposit-step-three/deposit-step-three.component';
import { DepositSummaryComponent } from './component/deposit/deposit-summary/deposit-summary.component';
import { DepositResultComponent } from './component/deposit/deposit-result/deposit-result.component';
import { AddCardComponent } from './component/add-card/add-card.component';
import { AddBankComponent } from './component/add-bank/add-bank.component';
import { ManagerBankAccountComponent } from './component/manager-bank-account/manager-bank-account.component';
import { TransactionHistorySearchComponent } from './component/transaction/transaction-history-search/transaction-history-search.component';
import { TransactionHistoryTableComponent } from './component/transaction/transaction-history-table/transaction-history-table.component';
import { VertualCardsSearchComponent } from './component/vertual-card/vertual-cards-search/vertual-cards-search.component';
import { VertualCardListComponent } from './component/vertual-card/vertual-card-list/vertual-card-list.component';
import { ContactDetailsComponent } from './component/profile/contact-details/contact-details.component';
import { InvoicingInfoComponent } from './component/profile/invoicing-info/invoicing-info.component';
import { ECommerceSettingComponent } from './component/profile/e-commerce-setting/e-commerce-setting.component';
import { UserAgentManagerComponent } from './component/user-agent/user-agent-manager/user-agent-manager.component';
import { UserAgentCreateComponent } from './component/user-agent/user-agent-create/user-agent-create.component';
import { ManagerCreditCardComponent } from './component/manager-credit-card/manager-credit-card.component';
import { VerifyCardComponent } from './component/verify-card/verify-card.component';
import { EditInvoicingComponent } from './component/profile/edit-invoicing/edit-invoicing.component';
import { EditECommerceSettingComponent } from './component/profile/edit-e-commerce-setting/edit-e-commerce-setting.component';
import { EditContractComponent } from './component/profile/edit-contract/edit-contract.component';
import { WithdrawChooseBankComponent } from './component/withdraw/withdraw-choose-bank/withdraw-choose-bank.component';
import { WithdrawTypeComponent } from './component/withdraw/withdraw-type/withdraw-type.component';
import { WithdrawChooseCardComponent } from './component/withdraw/withdraw-choose-card/withdraw-choose-card.component';
import { WithdrawDetailComponent } from './component/withdraw/withdraw-detail/withdraw-detail.component';
import { WithdrawResultComponent } from './component/withdraw/withdraw-result/withdraw-result.component';
import { DeleteBankComponent } from './component/delete-bank/delete-bank.component';
import { WalletLoginComponent } from './component/wallet-login/wallet-login.component';
import { WithdrawListComponent } from './component/withdraw/withdraw-list/withdraw-list.component';
import { UploadDocumentComponent } from './component/agent-summary/upload-document/upload-document.component';
import { DocumentListComponent } from './component/agent-summary/document-list/document-list.component';
import { RegisterComponent } from './register/register.component';
import { RegisterPannelComponent } from './component/register/register-pannel/register-pannel.component';
import { InfoPannelComponent } from './component/register/info-pannel/info-pannel.component';
import { VerifyAddressComponent } from './component/agent-summary/verify-address/verify-address.component';


@NgModule({
  declarations: [
    AgentSummaryComponent,
    BalanceComponent,
    DepositLimitComponent,
    MyDetailsComponent,
    QuickLinksComponent,
    AccountInfoComponent,
    DepositMoneyComponent,
    WithdrawMoneyComponent,
    BankAccountComponent,
    CreditCardComponent,
    VertualCardComponent,
    CompletedTransactionsComponent,
    ProfileComponent,
    UserAgentComponent,
    DepositStepOneComponent,
    DepositStepTwoComponent,
    DepositStepThreeComponent,
    DepositSummaryComponent,
    DepositResultComponent,
    WithdrawTypeComponent,
    AddCardComponent,
    AddBankComponent,
    ManagerBankAccountComponent,
    TransactionHistorySearchComponent,
    TransactionHistoryTableComponent,
    VertualCardsSearchComponent,
    VertualCardListComponent,
    ContactDetailsComponent,
    InvoicingInfoComponent,
    ECommerceSettingComponent,
    UserAgentManagerComponent,
    UserAgentCreateComponent,
    ManagerCreditCardComponent,
    VerifyCardComponent,
    EditInvoicingComponent,
    EditECommerceSettingComponent,
    EditContractComponent,
    WithdrawChooseBankComponent,
    WithdrawChooseCardComponent,
    WithdrawDetailComponent,
    WithdrawResultComponent,
    DeleteBankComponent,
    WalletLoginComponent,
    WithdrawListComponent,
    UploadDocumentComponent,
    DocumentListComponent,
    RegisterComponent,
    RegisterPannelComponent,
    InfoPannelComponent,
    VerifyAddressComponent,
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    WalletRoutingModule,
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
export class WalletModule {

  constructor(public translate: TranslateService) {
    translate.setDefaultLang ('en');
    translate.use('en');
  }

}



// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
