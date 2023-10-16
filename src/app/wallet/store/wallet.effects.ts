import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as WalletActions from './wallet.actions';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionHistoryReq } from 'src/app/model/wallet/transaction/transaction-history-req';
import { walletConstant } from '../wallet.constant';
import { TransactionItem } from 'src/app/model/wallet/transaction/transactiono-item';
import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { BankModel } from 'src/app/model/wallet/bank-account/bank-model';
import { PaymentOption } from 'src/app/model/wallet/deposit/deposit.option';
import { ExchangeResponse } from 'src/app/model/wallet/deposit/exchange-rate-response';
import { DepositOrderRes } from 'src/app/model/wallet/deposit/deposit-order-res';
import { WithdrawCreateRes } from 'src/app/model/wallet/withdraw/withdraw-create-res';
import { WithdrawItem } from 'src/app/model/wallet/withdraw/withdraw-item';
import { VCNInfo } from 'src/app/model/wallet/vcn/vcn-info';
import { VCNInfoDetail } from 'src/app/model/wallet/vcn/vcn-info-detail';
import { GetOptionRes } from 'src/app/model/wallet/deposit/deposit.option-res';
import { DepositRes } from 'src/app/model/wallet/deposit/deposit-res';
import { ListAllCardRes } from 'src/app/model/wallet/vcn/vcn-res';
import { TransactionHitoryRes } from 'src/app/model/wallet/transaction/transaction-history-res';
import { MerchantSettingRes } from 'src/app/model/wallet/merchant-setting/merchant-setting-res';
import { UserProfileRes } from 'src/app/model/wallet/profile/user-profile-res';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';
import { SummaryBalanceRes } from 'src/app/model/wallet/summary/balance-summary-res';
import { DepositFeeRes } from 'src/app/model/wallet/deposit/fee/deposit-fee-res';

const transactionHistoryUrl = environment.baseUrl + 'wallet/transactions';
const getProfileUrl = environment.baseUrl + 'wallet/profile';
const getBalanceSummaryUrl = environment.baseUrl + 'wallet/summary/balance';
const getBankListUrl = environment.baseUrl + 'wallet/bankAccount/bankList';
const depositOptionUrl = environment.baseUrl + 'wallet/deposit/paymentOptions';
const exchangeRateUrl = environment.baseUrl + 'wallet/deposit/exchangeRate';
const depositFeeUrl = environment.baseUrl + 'wallet/deposit/fee';
const depositUrl = environment.baseUrl + 'wallet/deposit';
const withdrawCreateUrl = environment.baseUrl + 'wallet/withdraw';
const withdrawListUrl = environment.baseUrl + 'wallet/withdraw';
const walletVcnUrl = environment.baseUrl + 'wallet/vcn';
const walletMerchantSettingUrl = environment.baseUrl + 'wallet/merchantSetting';

const handletransactionHistoryResult = (transactionHistoryRes: TransactionHitoryRes) => {
    sessionStorage.setItem(walletConstant.TRANSACTION_HISTORY_RES, JSON.stringify(transactionHistoryRes));
    return new WalletActions.GetWalletTransactionSuccess(transactionHistoryRes);
};

const handleMerchantProfileResult = (merchantProfileRes: UserInfoRes) => {
    sessionStorage.setItem(walletConstant.MERCHANT_PROFILE_RES, JSON.stringify(merchantProfileRes));
    return new WalletActions.GetMerchantProfileSuccess(merchantProfileRes);
};

const handleBalanceSummaryResult = (balanceSummaryRes: SummaryBalanceRes) => {
  sessionStorage.setItem(walletConstant.BALANCE_SUMMARY_RES, JSON.stringify(balanceSummaryRes));
  return new WalletActions.GetBalanceSummarySuccess(balanceSummaryRes);
};

const handleGetBankListResult = (balanceSummaryRes: BankModel[]) => {
  sessionStorage.setItem(walletConstant.BANK_LIST_RES, JSON.stringify(balanceSummaryRes));
  return new WalletActions.GetBankListSuccess(balanceSummaryRes);
};

const handleDepositOptionResult = (depositOptionRes: GetOptionRes) => {
  sessionStorage.setItem(walletConstant.DEPOSIT_OPTION_RES, JSON.stringify(depositOptionRes));
  return new WalletActions.GetDepositOptionSuccess(depositOptionRes);
};

const handleExchangeRateResult = (exchangeRateRes: ExchangeResponse) => {
  sessionStorage.setItem(walletConstant.EXCHANGE_RATE_RES, JSON.stringify(exchangeRateRes));
  return new WalletActions.GetExchangeRateSuccess(exchangeRateRes);
};

const handleDepositResult = (depositRes: DepositRes) => {
  sessionStorage.setItem(walletConstant.DEPOSIT_RES, JSON.stringify(depositRes));
  return new WalletActions.DepositSuccess(depositRes);
};

const handleDepositFeeResult = (depositFeeRes: DepositFeeRes) => {
  sessionStorage.setItem(walletConstant.DEPOSIT_FEE_RES, JSON.stringify(depositFeeRes));
  return new WalletActions.GetDepositFeeSuccess(depositFeeRes);
};

const handleWithdrawResult = (withdrawListRes: WithdrawCreateRes) => {
  sessionStorage.setItem(walletConstant.WITHDRAW_RES, JSON.stringify(withdrawListRes));
  return new WalletActions.WithdrawSuccess(withdrawListRes);
};

const handleWithdrawListResult = (withdrawListRes: WithdrawItem[]) => {
  sessionStorage.setItem(walletConstant.WITHDRAW_LIST_RES, JSON.stringify(withdrawListRes));
  return new WalletActions.WithdrawListSuccess(withdrawListRes);
};

const handleVcnListResult = (vcnListRes: ListAllCardRes) => {
  sessionStorage.setItem(walletConstant.VCN_LIST_RES, JSON.stringify(vcnListRes));
  return new WalletActions.VCNListSuccess(vcnListRes);
};

const handleVcnDetailResult = (vcnDetailRes: VCNInfoDetail) => {
  sessionStorage.setItem(walletConstant.VCN_DETAIL_RES, JSON.stringify(vcnDetailRes));
  return new WalletActions.VCNDetailSuccess(vcnDetailRes);
};

const handleMerchantSettingResult = (merchantSettingRes: MerchantSettingRes) => {
  sessionStorage.setItem(walletConstant.MERCHANT_SETTING_RES, JSON.stringify(merchantSettingRes));
  return new WalletActions.GetMerchantSettingSuccess(merchantSettingRes);
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new WalletActions.GetWalletTransactionFail(errorMessage));
};

const handleDepositError = (errorRes: any) => {
  console.log(errorRes);
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new WalletActions.DepositFail(errorMessage));
};


 const addUserIdHeader = (userId: string): HttpHeaders => {
  let headers = new HttpHeaders();
  headers = headers.set('user-id', `${userId}`);
  return headers;
};

const addUserIdAndCardTokenHeader = (userId: string, cardToken: string): HttpHeaders => {
  let headers = new HttpHeaders();
  headers = headers.set('user-id', userId)
                    .set('vcn-token', cardToken);
  return headers;
};

@Injectable()
export class WalletEffects {
  @Effect()
  transactionHistory = this.actions$.pipe(
    ofType(WalletActions.GET_WALLET_TRANSACTION_START),
    switchMap((actionData: WalletActions.GetWalletTransactionStart) => {
      const data: TransactionHistoryReq = actionData.payload.data;
      const userId = actionData.payload.userId;
      sessionStorage.setItem(walletConstant.TRANSACTION_HISTORY_REQ, JSON.stringify(data));

      let headers = new HttpHeaders();
      headers = headers.set('user-id', `${userId}`);
      return this.http
        .post<TransactionHitoryRes>(transactionHistoryUrl, data, { headers })
        .pipe(
          map((res: TransactionHitoryRes) => {
            return handletransactionHistoryResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  merchantProfile = this.actions$.pipe(
    ofType(WalletActions.GET_MERCHANT_PROFILE_START),
    switchMap((actionData: WalletActions.GetMerchantProfileStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      return this.http
        .get<UserInfoRes>(getProfileUrl, { headers })
        .pipe(
          map((res: UserInfoRes) => {
            return handleMerchantProfileResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  balanceSummary = this.actions$.pipe(
    ofType(WalletActions.GET_BALANCE_SUMMARY_START),
    switchMap((actionData: WalletActions.GetBalanceSummaryStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      return this.http
        .get<SummaryBalanceRes>(getBalanceSummaryUrl, { headers })
        .pipe(
          map((res: SummaryBalanceRes) => {
            return handleBalanceSummaryResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  bankList = this.actions$.pipe(
    ofType(WalletActions.GET_BANK_LIST_START),
    switchMap((actionData: WalletActions.GetBankListStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      return this.http
        .get<BankModel[]>(getBankListUrl, { headers })
        .pipe(
          map((res: BankModel[]) => {
            return handleGetBankListResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  depositOption = this.actions$.pipe(
    ofType(WalletActions.GET_DEPOSIT_OPTION_START),
    switchMap((actionData: WalletActions.GetDepositOptionStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      const countyCode = actionData.payload.countyCode;
      const currencyCode = actionData.payload.currencyCode;
      let params = new HttpParams();
      params = params.append('countyCode', countyCode);
      params = params.append('currencyCode', currencyCode);
      return this.http
        .get<GetOptionRes>(depositOptionUrl, { headers, params })
        .pipe(
          map((res: GetOptionRes) => {
            return handleDepositOptionResult(res);
          }),
          catchError((errorRes) => {
            return handleDepositError(errorRes);
          })
        );
    })
  );

  @Effect()
  exchangeRate = this.actions$.pipe(
    ofType(WalletActions.GET_EXCHANGE_RATE_START),
    switchMap((actionData: WalletActions.GetExchangeRateStart) => {

      const source = actionData.payload.source;
      const dest = actionData.payload.dest;
      let params = new HttpParams();
      params = params.append('source', source);
      params = params.append('dest', dest);
      return this.http
        .get<ExchangeResponse>(exchangeRateUrl, { params })
        .pipe(
          map((res: ExchangeResponse) => {
            return handleExchangeRateResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  depositFee = this.actions$.pipe(
    ofType(WalletActions.GET_DEPOSIT_FEE_START),
    switchMap((actionData: WalletActions.GetDepositFeeStart) => {
      const userId = actionData.payload.userId;
      const data = actionData.payload.data;
      const headers = addUserIdHeader(userId);
      return this.http
        .post<DepositFeeRes>(depositFeeUrl, data, { headers })
        .pipe(
          map((res: DepositFeeRes) => {
            return handleDepositFeeResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  deposit = this.actions$.pipe(
    ofType(WalletActions.DEPOSIT_START),
    switchMap((actionData: WalletActions.DepositStart) => {
      const userId = actionData.payload.userId;
      const data = actionData.payload.data;
      const headers = addUserIdHeader(userId);
      return this.http
        .post<DepositRes>(depositUrl, data, { headers })
        .pipe(
          map((res: DepositRes) => {
            return handleDepositResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );


  @Effect()
  withdraw = this.actions$.pipe(
    ofType(WalletActions.WITHDRAW_START),
    switchMap((actionData: WalletActions.WithdrawStart) => {
      const userId = actionData.payload.userId;
      const data = actionData.payload.data;
      const headers = addUserIdHeader(userId);
      return this.http
        .post<WithdrawCreateRes>(withdrawCreateUrl, data, { headers })
        .pipe(
          map((res: WithdrawCreateRes) => {
            return handleWithdrawResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );


  @Effect()
  withdrawList = this.actions$.pipe(
    ofType(WalletActions.WITHDRAW_LIST_START),
    switchMap((actionData: WalletActions.WithdrawListStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      return this.http
        .get<WithdrawItem[]>(withdrawListUrl, { headers })
        .pipe(
          map((res: WithdrawItem[]) => {
            return handleWithdrawListResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  vcnList = this.actions$.pipe(
    ofType(WalletActions.VCN_LIST_START),
    switchMap((actionData: WalletActions.VCNListStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      return this.http
        .get<ListAllCardRes>(walletVcnUrl, { headers })
        .pipe(
          map((res: ListAllCardRes) => {
            return handleVcnListResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  vcnDetail = this.actions$.pipe(
    ofType(WalletActions.VCN_DETAIL_START),
    switchMap((actionData: WalletActions.VCNDetailStart) => {
      const vcnId = actionData.payload.id;
      const userId = actionData.payload.userId;
      const cardToken = actionData.payload.cardToken;
      const headers = addUserIdAndCardTokenHeader(userId, cardToken);
      return this.http
        .get<VCNInfoDetail>(`${walletVcnUrl}/${vcnId}`, { headers })
        .pipe(
          map((res: VCNInfoDetail) => {
            return handleVcnDetailResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  getMerchantSetting = this.actions$.pipe(
    ofType(WalletActions.GET_MERCHANT_SETTING_START),
    switchMap((actionData: WalletActions.GetMerchantSettingStart) => {
      const userId = actionData.payload.userId;
      const headers = addUserIdHeader(userId);
      return this.http
        .get<MerchantSettingRes>(`${walletMerchantSettingUrl}`, { headers })
        .pipe(
          map((res: MerchantSettingRes) => {
            return handleMerchantSettingResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  changeMerchantSetting = this.actions$.pipe(
    ofType(WalletActions.CHANGE_MERCHANT_SETTING_START),
    switchMap((actionData: WalletActions.ChangeMerchantSettingStart) => {
      const userId = actionData.payload.userId;
      const data = actionData.payload.data;
      const headers = addUserIdHeader(userId);
      return this.http
        .post<MerchantSettingRes>(`${walletMerchantSettingUrl}`, data, { headers })
        .pipe(
          map((res: MerchantSettingRes) => {
            return handleMerchantSettingResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private route: Router,
    public datepipe: DatePipe,
  ) {}
}
