import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "../shared/layouts/admin-layout/admin-layout.component";

import { AgentSummaryComponent } from "./agent-summary/agent-summary.component";
import { BankAccountComponent } from "./bank-account/bank-account.component";
import { CompletedTransactionsComponent } from "./completed-transactions/completed-transactions.component";
import { AddBankComponent } from "./component/add-bank/add-bank.component";
import { AddCardComponent } from "./component/add-card/add-card.component";
import { AccountInfoComponent } from "./component/agent-summary/account-info/account-info.component";
import { DocumentListComponent } from "./component/agent-summary/document-list/document-list.component";
import { UploadDocumentComponent } from "./component/agent-summary/upload-document/upload-document.component";
import { VerifyAddressComponent } from "./component/agent-summary/verify-address/verify-address.component";
import { DeleteBankComponent } from "./component/delete-bank/delete-bank.component";
import { DepositResultComponent } from "./component/deposit/deposit-result/deposit-result.component";
import { DepositStepOneComponent } from "./component/deposit/deposit-step-one/deposit-step-one.component";
import { DepositStepThreeComponent } from "./component/deposit/deposit-step-three/deposit-step-three.component";
import { DepositStepTwoComponent } from "./component/deposit/deposit-step-two/deposit-step-two.component";
import { DepositSummaryComponent } from "./component/deposit/deposit-summary/deposit-summary.component";
import { ManagerBankAccountComponent } from "./component/manager-bank-account/manager-bank-account.component";
import { ManagerCreditCardComponent } from "./component/manager-credit-card/manager-credit-card.component";
import { TransactionHistorySearchComponent } from "./component/transaction/transaction-history-search/transaction-history-search.component";
import { UserAgentCreateComponent } from "./component/user-agent/user-agent-create/user-agent-create.component";
import { UserAgentManagerComponent } from "./component/user-agent/user-agent-manager/user-agent-manager.component";
import { VerifyCardComponent } from "./component/verify-card/verify-card.component";
import { WalletLoginComponent } from "./component/wallet-login/wallet-login.component";
import { WithdrawChooseBankComponent } from "./component/withdraw/withdraw-choose-bank/withdraw-choose-bank.component";
import { WithdrawChooseCardComponent } from "./component/withdraw/withdraw-choose-card/withdraw-choose-card.component";
import { WithdrawDetailComponent } from "./component/withdraw/withdraw-detail/withdraw-detail.component";
import { WithdrawResultComponent } from "./component/withdraw/withdraw-result/withdraw-result.component";
import { WithdrawTypeComponent } from "./component/withdraw/withdraw-type/withdraw-type.component";
import { DepositMoneyComponent } from "./deposit-money/deposit-money.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { UserAgentComponent } from "./user-agent/user-agent.component";
import { VertualCardComponent } from "./vertual-card/vertual-card.component";
import { WithdrawMoneyComponent } from "./withdraw-money/withdraw-money.component";

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      { path: "", redirectTo: "summary", pathMatch: "full" },
      {
        path: "summary",
        component: AgentSummaryComponent,
        children: [
          { path: "", redirectTo: "accountInfo", pathMatch: "full" },
          { path: "accountInfo", component: AccountInfoComponent },
          { path: "uploadDocument", component: UploadDocumentComponent },
          { path: "documentList", component: DocumentListComponent },
          { path: "verifyAddress", component: VerifyAddressComponent },
        ],
      },
      {
        path: "deposit",
        component: DepositMoneyComponent,
        children: [
          { path: "", redirectTo: "step1", pathMatch: "full" },
          { path: "step1", component: DepositStepOneComponent },
          { path: "step2", component: DepositStepTwoComponent },
          { path: "step3", component: DepositStepThreeComponent },
          { path: "summary", component: DepositSummaryComponent },
          { path: "depositResult", component: DepositResultComponent },
        ],
      },
      {
        path: "withdraw",
        component: WithdrawMoneyComponent,
        children: [
          { path: "", redirectTo: "withdrawType", pathMatch: "full" },
          { path: "withdrawType", component: WithdrawTypeComponent },
          { path: "withdrawBank", component: WithdrawChooseBankComponent },
          { path: "withdrawCard", component: WithdrawChooseCardComponent },
          { path: "withdrawDetail", component: WithdrawDetailComponent },
          { path: "withdrawResult", component: WithdrawResultComponent },
        ],
      },
      {
        path: "bankAccount",
        component: BankAccountComponent,
        children: [
          { path: "", redirectTo: "bankManager", pathMatch: "full" },
          { path: "bankManager", component: ManagerBankAccountComponent },
          { path: "addBank", component: AddBankComponent },
          { path: "deleteBank/:bankId", component: DeleteBankComponent },
        ],
      },
      {
        path: "creditCard",
        component: BankAccountComponent,
        children: [
          { path: "", redirectTo: "cardManager", pathMatch: "full" },
          { path: "cardManager", component: ManagerCreditCardComponent },
          { path: "addCard", component: AddCardComponent },
          { path: "verifyCard", component: VerifyCardComponent },
        ],
      },
      {
        path: "completeTransaction",
        component: CompletedTransactionsComponent,
      },
      {
        path: "userAgent",
        component: UserAgentComponent,
        children: [
          { path: "", redirectTo: "userManager", pathMatch: "full" },
          { path: "userManager", component: UserAgentManagerComponent },
          { path: "addUser", component: UserAgentCreateComponent },
        ],
      },
      { path: "vertualCard", component: VertualCardComponent },
      { path: "withdraw", component: WithdrawMoneyComponent },
      { path: "addCard", component: AddCardComponent },
      { path: "addBank", component: AddBankComponent },
      { path: "profile", component: ProfileComponent },
    ],
  },
  {
    path: "login",
    component: WalletLoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
