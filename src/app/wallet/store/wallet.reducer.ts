import * as WalletActions from "./wallet.actions";

import { TransactionHistoryReq } from "src/app/model/wallet/transaction/transaction-history-req";
import { TransactionHitoryRes } from "src/app/model/wallet/transaction/transaction-history-res";
import { AccountSummary } from "src/app/model/wallet/summary/account-summary";
import { walletConstant } from "../wallet.constant";
import { BankModel } from "src/app/model/wallet/bank-account/bank-model";
import { ExchangeResponse } from "src/app/model/wallet/deposit/exchange-rate-response";
import { WithdrawCreateRes } from "src/app/model/wallet/withdraw/withdraw-create-res";
import { WithdrawItem } from "src/app/model/wallet/withdraw/withdraw-item";
import { VCNInfoDetail } from "src/app/model/wallet/vcn/vcn-info-detail";
import { GetOptionRes } from "src/app/model/wallet/deposit/deposit.option-res";
import { DepositRes } from "src/app/model/wallet/deposit/deposit-res";
import { ListAllCardRes } from "src/app/model/wallet/vcn/vcn-res";
import { MerchantSettingRes } from "src/app/model/wallet/merchant-setting/merchant-setting-res";
import { UserInfoRes } from "src/app/model/wallet/profile/user-info-res";
import { SummaryBalanceRes } from "src/app/model/wallet/summary/balance-summary-res";
import { DepositFeeRes } from "src/app/model/wallet/deposit/fee/deposit-fee-res";

export interface State {
  transactionHistoryReq: TransactionHistoryReq;
  transactionHistoryRes: TransactionHitoryRes;
  merchantProfileRes: UserInfoRes;
  balanceSummaryRes: SummaryBalanceRes;
  bankListRes: BankModel[];
  depositOptionRes: GetOptionRes;
  depositFeeRes: DepositFeeRes;
  exchangeRateRes: ExchangeResponse;
  depositRes: DepositRes;
  withrawRes: WithdrawCreateRes;
  withdrawListRes: WithdrawItem[];
  vcnListRes: ListAllCardRes;
  vcnDetailRes: VCNInfoDetail;
  merchantSettingRes: MerchantSettingRes;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  transactionHistoryReq: null,
  transactionHistoryRes: JSON.parse(sessionStorage.getItem(walletConstant.TRANSACTION_HISTORY_RES)),
  merchantProfileRes: JSON.parse(sessionStorage.getItem(walletConstant.MERCHANT_PROFILE_RES)),
  balanceSummaryRes: JSON.parse(sessionStorage.getItem(walletConstant.BALANCE_SUMMARY_RES)),
  bankListRes: JSON.parse(sessionStorage.getItem(walletConstant.BANK_LIST_RES)) || [],
  depositOptionRes: JSON.parse(sessionStorage.getItem(walletConstant.DEPOSIT_OPTION_RES)),
  depositFeeRes: JSON.parse(sessionStorage.getItem(walletConstant.DEPOSIT_FEE_RES)),
  exchangeRateRes: JSON.parse(sessionStorage.getItem(walletConstant.EXCHANGE_RATE_RES)),
  depositRes: JSON.parse(sessionStorage.getItem(walletConstant.DEPOSIT_RES)),
  withrawRes: JSON.parse(sessionStorage.getItem(walletConstant.WITHDRAW_RES)),
  withdrawListRes: JSON.parse(sessionStorage.getItem(walletConstant.WITHDRAW_LIST_RES))|| [],
  vcnListRes: JSON.parse(sessionStorage.getItem(walletConstant.VCN_LIST_RES)),
  vcnDetailRes: JSON.parse(sessionStorage.getItem(walletConstant.VCN_DETAIL_RES)),
  merchantSettingRes: JSON.parse(sessionStorage.getItem(walletConstant.MERCHANT_SETTING_RES)),
  errorMessage: null,
  loading: false,
  failure: false,
};

export function walletReducer(
  state: State = initialState,
  action: WalletActions.WalletActions
) {
  switch (action.type) {
    case WalletActions.WALLET_INITIAL:
      return {
        ...state,
        transactionHistoryReq: null,
        transactionHistoryRes: null,
        merchantProfileRes: null,
        balanceSummaryRes: null,
        bankListRes: [],
        depositOptionRes: null,
        exchangeRateRes: null,
        depositRes: null,
        withrawRes: null,
        withdrawListRes: [],
        vcnListRes: null,
        vcnDetailRes: null,
        merchantSettingRes: null,
        errorMessage: null,
        loading: false,
        failure: false,
      };

    case WalletActions.GET_WALLET_TRANSACTION_START:
      return {
        ...state,
        transactionHistoryReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case WalletActions.GET_WALLET_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactionHistoryRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_WALLET_TRANSACTION_FAIL:
      return {
        ...state,
        transactionHistoryRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case WalletActions.GET_MERCHANT_PROFILE_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.GET_MERCHANT_PROFILE_SUCCESS:
      return {
        ...state,
        merchantProfileRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_MERCHANT_PROFILE_FAIL:
      return {
        ...state,
        merchantProfileRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case WalletActions.GET_BALANCE_SUMMARY_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.GET_BALANCE_SUMMARY_SUCCESS:
      return {
        ...state,
        balanceSummaryRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_BALANCE_SUMMARY_FAIL:
      return {
        ...state,
        balanceSummaryRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case WalletActions.GET_BANK_LIST_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.GET_BANK_LIST_SUCCESS:
      return {
        ...state,
        bankListRes: [...action.payload],
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_BANK_LIST_FAIL:
      return {
        ...state,
        bankListRes: [],
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case WalletActions.GET_DEPOSIT_OPTION_START:
        return {
          ...state,
          depositRes: null,
          loading: true,
          failure: false,
        };
    case WalletActions.GET_DEPOSIT_OPTION_SUCCESS:
      return {
        ...state,
        depositOptionRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_DEPOSIT_OPTION_FAIL:
      return {
        ...state,
        depositOptionRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
      case WalletActions.GET_DEPOSIT_FEE_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.GET_DEPOSIT_FEE_SUCCESS:
      return {
        ...state,
        depositFeeRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_DEPOSIT_FEE_FAIL:
      return {
        ...state,
        depositFeeRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case WalletActions.GET_EXCHANGE_RATE_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.GET_EXCHANGE_RATE_SUCCESS:
      return {
        ...state,
        exchangeRateRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.GET_EXCHANGE_RATE_FAIL:
      return {
        ...state,
        exchangeRateRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case WalletActions.DEPOSIT_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.DEPOSIT_SUCCESS:
      return {
        ...state,
        depositRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.DEPOSIT_FAIL:
      return {
        ...state,
        depositRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case WalletActions.WITHDRAW_START:
        return {
          ...state,
          loading: true,
          failure: false,
        };
    case WalletActions.WITHDRAW_SUCCESS:
      return {
        ...state,
        withrawRes: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case WalletActions.WITHDRAW_FAIL:
      return {
        ...state,
        withrawRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case WalletActions.WITHDRAW_LIST_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case WalletActions.WITHDRAW_LIST_SUCCESS:
    return {
      ...state,
      withdrawListRes: [...action.payload],
      errorMessage: null,
      loading: false,
      failure: false,
    };
    case WalletActions.WITHDRAW_LIST_FAIL:
    return {
      ...state,
      depositRes: null,
      withdrawListRes: [],
      loading: false,
      failure: true,
    };

    case WalletActions.VCN_LIST_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case WalletActions.VCN_LIST_SUCCESS:
    return {
      ...state,
      vcnListRes: Object.assign({}, action.payload),
      errorMessage: null,
      loading: false,
      failure: false,
    };
    case WalletActions.VCN_LIST_FAIL:
    return {
      ...state,
      depositRes: null,
      vcnListRes: null,
      loading: false,
      failure: true,
    };

    case WalletActions.VCN_DETAIL_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case WalletActions.VCN_DETAIL_SUCCESS:
    return {
      ...state,
      vcnDetailRes: Object.assign({}, action.payload),
      errorMessage: null,
      loading: false,
      failure: false,
    };
    case WalletActions.VCN_DETAIL_FAIL:
    return {
      ...state,
      vcnDetailRes: null,
      loading: false,
      failure: true,
    };

    case WalletActions.GET_MERCHANT_SETTING_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case WalletActions.GET_MERCHANT_SETTING_SUCCESS:
    return {
      ...state,
      merchantSettingRes: Object.assign({}, action.payload),
      errorMessage: null,
      loading: false,
      failure: false,
    };
    case WalletActions.GET_MERCHANT_SETTING_FAIL:
    return {
      ...state,
      merchantSettingRes: null,
      loading: false,
      failure: true,
    };

    case WalletActions.CHANGE_MERCHANT_SETTING_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case WalletActions.CHANGE_MERCHANT_SETTING_SUCCESS:
    return {
      ...state,
      merchantSettingRes: Object.assign({}, action.payload),
      errorMessage: null,
      loading: false,
      failure: false,
    };
    case WalletActions.CHANGE_MERCHANT_SETTING_FAIL:
    return {
      ...state,
      merchantSettingRes: null,
      loading: false,
      failure: true,
    };
    default:
      return state;
  }
}
