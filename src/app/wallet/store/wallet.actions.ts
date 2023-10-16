import { Action } from '@ngrx/store';
import { BankModel } from 'src/app/model/wallet/bank-account/bank-model';
import { DepositReq } from 'src/app/model/wallet/deposit/deposit-req';
import { DepositOrderRes } from 'src/app/model/wallet/deposit/deposit-order-res';
import { PaymentOption } from 'src/app/model/wallet/deposit/deposit.option';
import { GetOptionRes } from 'src/app/model/wallet/deposit/deposit.option-res';
import { ExchangeResponse } from 'src/app/model/wallet/deposit/exchange-rate-response';
import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { AccountSummary } from 'src/app/model/wallet/summary/account-summary';

import { TransactionHistoryReq } from 'src/app/model/wallet/transaction/transaction-history-req';
import { TransactionItem } from 'src/app/model/wallet/transaction/transactiono-item';
import { VCNInfo } from 'src/app/model/wallet/vcn/vcn-info';
import { VCNInfoDetail } from 'src/app/model/wallet/vcn/vcn-info-detail';
import { WithdrawCreateReq } from 'src/app/model/wallet/withdraw/withdraw-create-req';
import { WithdrawCreateRes } from 'src/app/model/wallet/withdraw/withdraw-create-res';
import { WithdrawItem } from 'src/app/model/wallet/withdraw/withdraw-item';
import { DepositRes } from 'src/app/model/wallet/deposit/deposit-res';
import { ListAllCardRes } from 'src/app/model/wallet/vcn/vcn-res';
import { TransactionHitoryRes } from 'src/app/model/wallet/transaction/transaction-history-res';
import { MerchantSettingRes } from 'src/app/model/wallet/merchant-setting/merchant-setting-res';
import { MerchantSettingCreateReq } from 'src/app/model/wallet/merchant-setting/merchant-setting-create.req';
import { UserProfileRes } from 'src/app/model/wallet/profile/user-profile-res';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';
import { SummaryBalanceRes } from 'src/app/model/wallet/summary/balance-summary-res';
import { DepositFeeReq } from 'src/app/model/wallet/deposit/fee/deposit-fee-req';
import { DepositFeeRes } from 'src/app/model/wallet/deposit/fee/deposit-fee-res';


export const WALLET_INITIAL = '[Wallet] WALLET_INITIAL';

export const GET_WALLET_TRANSACTION_START = '[Wallet] GET_WALLET_TRANSACTION_START';
export const GET_WALLET_TRANSACTION_SUCCESS = '[Wallet] GET_WALLET_TRANSACTION_SUCCESS';
export const GET_WALLET_TRANSACTION_FAIL = '[Wallet] GET_WALLET_TRANSACTION_FAIL';

export const GET_MERCHANT_PROFILE_START = '[Wallet] GET_MERCHANT_PROFILE_START';
export const GET_MERCHANT_PROFILE_SUCCESS = '[Wallet] GET_MERCHANT_PROFILE_SUCCESS';
export const GET_MERCHANT_PROFILE_FAIL = '[Wallet] GET_MERCHANT_PROFILE_FAIL';

export const GET_BALANCE_SUMMARY_START = '[Wallet] GET_BALANCE_SUMMARY_START';
export const GET_BALANCE_SUMMARY_SUCCESS = '[Wallet] GET_BALANCE_SUMMARY_SUCCESS';
export const GET_BALANCE_SUMMARY_FAIL = '[Wallet] GET_BALANCE_SUMMARY_FAIL';

export const GET_BANK_LIST_START = '[Wallet] GET_BANK_LIST_START';
export const GET_BANK_LIST_SUCCESS = '[Wallet] GET_BANK_LIST_SUCCESS';
export const GET_BANK_LIST_FAIL = '[Wallet] GET_BANK_LIST_FAIL';

export const GET_DEPOSIT_OPTION_START = '[Wallet] GET_DEPOSIT_OPTION_START';
export const GET_DEPOSIT_OPTION_SUCCESS = '[Wallet] GET_DEPOSIT_OPTION_SUCCESS';
export const GET_DEPOSIT_OPTION_FAIL = '[Wallet] GET_DEPOSIT_OPTION_FAIL';

export const GET_EXCHANGE_RATE_START = '[Wallet] GET_EXCHANGE_RATE_START';
export const GET_EXCHANGE_RATE_SUCCESS = '[Wallet] GET_EXCHANGE_RATE_SUCCESS';
export const GET_EXCHANGE_RATE_FAIL = '[Wallet] GET_EXCHANGE_RATE_FAIL';

export const GET_DEPOSIT_FEE_START = '[Wallet] GET_DEPOSIT_FEE_START';
export const GET_DEPOSIT_FEE_SUCCESS = '[Wallet] GET_DEPOSIT_FEE_SUCCESS';
export const GET_DEPOSIT_FEE_FAIL = '[Wallet] GET_DEPOSIT_FEE_FAIL';

export const DEPOSIT_START = '[Wallet] GET_DEPOSIT_START';
export const DEPOSIT_SUCCESS = '[Wallet] DEPOSIT_SUCCESS';
export const DEPOSIT_FAIL = '[Wallet] DEPOSIT_RATE_FAIL';

export const WITHDRAW_START = '[Wallet] GET_WITHDRAW_START';
export const WITHDRAW_SUCCESS = '[Wallet] WITHDRAW_SUCCESS';
export const WITHDRAW_FAIL = '[Wallet] WITHDRAW_RATE_FAIL';

export const WITHDRAW_LIST_START = '[Wallet] WITHDRAW_LIST_START';
export const WITHDRAW_LIST_SUCCESS = '[Wallet] WITHDRAW_LIST_SUCCESS';
export const WITHDRAW_LIST_FAIL = '[Wallet] WITHDRAW_LIST_RATE_FAIL';

export const VCN_LIST_START = '[Wallet] LIST_VCN_START';
export const VCN_LIST_SUCCESS = '[Wallet] VCN_LIST_SUCCESS';
export const VCN_LIST_FAIL = '[Wallet] VCN_LIST_RATE_FAIL';

export const VCN_DETAIL_START = '[Wallet] VCN_DETAIL_START';
export const VCN_DETAIL_SUCCESS = '[Wallet] VCN_DETAIL_SUCCESS';
export const VCN_DETAIL_FAIL = '[Wallet] VCN_DETAIL_FAIL';

export const GET_MERCHANT_SETTING_START = '[Wallet] GET_MERCHANT_SETTING_START';
export const GET_MERCHANT_SETTING_SUCCESS = '[Wallet] GET_MERCHANT_SETTING_SUCCESS';
export const GET_MERCHANT_SETTING_FAIL = '[Wallet] GET_MERCHANT_SETTING_FAIL';

export const CHANGE_MERCHANT_SETTING_START = '[Wallet] CHANGE_MERCHANT_SETTING_START';
export const CHANGE_MERCHANT_SETTING_SUCCESS = '[Wallet] CHANGE_MERCHANT_SETTING_SUCCESS';
export const CHANGE_MERCHANT_SETTING_FAIL = '[Wallet] CHANGE_MERCHANT_SETTING_FAIL';

export class WalletInitial implements Action {
  readonly type = WALLET_INITIAL;

  constructor() { }
}

export class GetWalletTransactionStart implements Action {
  readonly type = GET_WALLET_TRANSACTION_START;

  constructor(public payload: { data: TransactionHistoryReq, userId: string }) { }
}

export class GetWalletTransactionSuccess implements Action {
  readonly type = GET_WALLET_TRANSACTION_SUCCESS;

  constructor(public payload: TransactionHitoryRes) { }
}

export class GetWalletTransactionFail implements Action {
  readonly type = GET_WALLET_TRANSACTION_FAIL;

  constructor(public payload: string) { }
}

export class GetMerchantProfileStart implements Action {
  readonly type = GET_MERCHANT_PROFILE_START;

  constructor(public payload: { userId: string }) { }
}

export class GetMerchantProfileSuccess implements Action {
  readonly type = GET_MERCHANT_PROFILE_SUCCESS;

  constructor(public payload: UserInfoRes) { }
}

export class GetMerchantProfileFail implements Action {
  readonly type = GET_MERCHANT_PROFILE_FAIL;

  constructor(public payload: string) { }
}

export class GetBalanceSummaryStart implements Action {
  readonly type = GET_BALANCE_SUMMARY_START;

  constructor(public payload: { userId: string }) { }
}

export class GetBalanceSummarySuccess implements Action {
  readonly type = GET_BALANCE_SUMMARY_SUCCESS;

  constructor(public payload: SummaryBalanceRes) { }
}

export class GetBalanceSummaryFail implements Action {
  readonly type = GET_BALANCE_SUMMARY_FAIL;

  constructor(public payload: string) { }
}

export class GetBankListStart implements Action {
  readonly type = GET_BANK_LIST_START;

  constructor(public payload: { userId: string }) { }
}

export class GetBankListSuccess implements Action {
  readonly type = GET_BANK_LIST_SUCCESS;

  constructor(public payload: BankModel[]) { }
}

export class GetBankListFail implements Action {
  readonly type = GET_BANK_LIST_FAIL;

  constructor(public payload: string) { }
}

export class GetDepositOptionStart implements Action {
  readonly type = GET_DEPOSIT_OPTION_START;

  constructor(public payload: {userId: string; countyCode: string; currencyCode: string }) { }
}

export class GetDepositOptionSuccess implements Action {
  readonly type = GET_DEPOSIT_OPTION_SUCCESS;

  constructor(public payload: GetOptionRes) { }
}

export class GetDepositOptionFail implements Action {
  readonly type = GET_DEPOSIT_OPTION_FAIL;

  constructor(public payload: string) { }
}

export class GetExchangeRateStart implements Action {
  readonly type = GET_EXCHANGE_RATE_START;

  constructor(public payload: {source: string; dest: string }) { }
}

export class GetExchangeRateSuccess implements Action {
  readonly type = GET_EXCHANGE_RATE_SUCCESS;

  constructor(public payload: ExchangeResponse) { }
}

export class GetExchangeRateFail implements Action {
  readonly type = GET_EXCHANGE_RATE_FAIL;

  constructor(public payload: string) { }
}

export class GetDepositFeeStart implements Action {
  readonly type = GET_DEPOSIT_FEE_START;

  constructor(public payload: {data: DepositFeeReq, userId: string  }) { }
}

export class GetDepositFeeSuccess implements Action {
  readonly type = GET_DEPOSIT_FEE_SUCCESS;

  constructor(public payload: DepositFeeRes) { }
}

export class GetDepositFeeFail implements Action {
  readonly type = GET_DEPOSIT_FEE_FAIL;

  constructor(public payload: string) { }
}

export class DepositStart implements Action {
  readonly type = DEPOSIT_START;

  constructor(public payload: {data: DepositReq, userId: string  }) { }
}

export class DepositSuccess implements Action {
  readonly type = DEPOSIT_SUCCESS;

  constructor(public payload: DepositRes) { }
}

export class DepositFail implements Action {
  readonly type = DEPOSIT_FAIL;

  constructor(public payload: string) { }
}

export class WithdrawStart implements Action {
  readonly type = WITHDRAW_START;

  constructor(public payload: {data: WithdrawCreateReq, userId: string  }) { }
}

export class WithdrawSuccess implements Action {
  readonly type = WITHDRAW_SUCCESS;

  constructor(public payload: WithdrawCreateRes) { }
}

export class WithdrawFail implements Action {
  readonly type = WITHDRAW_FAIL;

  constructor(public payload: string) { }
}

export class WithdrawListStart implements Action {
  readonly type = WITHDRAW_LIST_START;

  constructor(public payload: { userId: string  }) { }
}

export class WithdrawListSuccess implements Action {
  readonly type = WITHDRAW_LIST_SUCCESS;

  constructor(public payload: WithdrawItem[]) { }
}

export class WithdrawListFail implements Action {
  readonly type = WITHDRAW_LIST_FAIL;

  constructor(public payload: string) { }
}

export class VCNListStart implements Action {
  readonly type = VCN_LIST_START;

  constructor(public payload: { userId: string  }) { }
}

export class VCNListSuccess implements Action {
  readonly type = VCN_LIST_SUCCESS;

  constructor(public payload: ListAllCardRes) { }
}

export class VCNListFail implements Action {
  readonly type = VCN_LIST_FAIL;

  constructor(public payload: string) { }
}

export class VCNDetailStart implements Action {
  readonly type = VCN_DETAIL_START;

  constructor(public payload: { id: string, userId: string, cardToken: string  }) { }
}

export class VCNDetailSuccess implements Action {
  readonly type = VCN_DETAIL_SUCCESS;

  constructor(public payload: VCNInfoDetail) { }
}

export class VCNDetailFail implements Action {
  readonly type = VCN_DETAIL_FAIL;

  constructor(public payload: string) { }
}

export class GetMerchantSettingStart implements Action {
  readonly type = GET_MERCHANT_SETTING_START;

  constructor(public payload: { userId: string}) { }
}

export class GetMerchantSettingSuccess implements Action {
  readonly type = GET_MERCHANT_SETTING_SUCCESS;

  constructor(public payload: MerchantSettingRes) { }
}

export class GetMerchantSettingFail implements Action {
  readonly type = GET_MERCHANT_SETTING_FAIL;

  constructor(public payload: string) { }
}

export class ChangeMerchantSettingStart implements Action {
  readonly type = CHANGE_MERCHANT_SETTING_START;

  constructor(public payload: { userId: string, data: MerchantSettingCreateReq}) { }
}

export class ChangeMerchantSettingSuccess implements Action {
  readonly type = CHANGE_MERCHANT_SETTING_SUCCESS;

  constructor(public payload: MerchantSettingRes) { }
}

export class ChangeMerchantSettingFail implements Action {
  readonly type = CHANGE_MERCHANT_SETTING_FAIL;

  constructor(public payload: string) { }
}

export type WalletActions =
  | WalletInitial
  | GetWalletTransactionStart
  | GetWalletTransactionSuccess
  | GetWalletTransactionFail
  | GetMerchantProfileStart
  | GetMerchantProfileSuccess
  | GetMerchantProfileFail
  | GetBalanceSummaryStart
  | GetBalanceSummarySuccess
  | GetBalanceSummaryFail
  | GetBankListStart
  | GetBankListSuccess
  | GetBankListFail
  | GetDepositOptionStart
  | GetDepositOptionSuccess
  | GetDepositOptionFail
  | GetExchangeRateStart
  | GetExchangeRateSuccess
  | GetExchangeRateFail
  | GetDepositFeeStart
  | GetDepositFeeSuccess
  | GetDepositFeeFail
  | DepositStart
  | DepositSuccess
  | DepositFail
  | WithdrawStart
  | WithdrawSuccess
  | WithdrawFail
  | WithdrawListStart
  | WithdrawListSuccess
  | WithdrawListFail
  | VCNListStart
  | VCNListSuccess
  | VCNListFail
  | VCNDetailStart
  | VCNDetailSuccess
  | VCNDetailFail
  | GetMerchantSettingStart
  | GetMerchantSettingSuccess
  | GetMerchantSettingFail
  | ChangeMerchantSettingStart
  | ChangeMerchantSettingSuccess
  | ChangeMerchantSettingFail;
