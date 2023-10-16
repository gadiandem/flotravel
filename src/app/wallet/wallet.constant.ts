export const walletConstant = {
  DEPOSIT_STEP_1: "[wallet] depositStep1",
  TRANSACTION_HISTORY_REQ: "[wallet] transactionHistoryReq",
  TRANSACTION_HISTORY_RES: "[wallet] transactionHistoryRes",
  MERCHANT_PROFILE_RES: "[wallet] merchantProfileRes",
  BALANCE_SUMMARY_RES: "[wallet] balanaceSummaryRes",
  BANK_LIST_RES: "[wallet] bankListRes",
  DEPOSIT_OPTION_RES: "[wallet] depositOptionRes",
  EXCHANGE_RATE_RES: "[wallet] exchangeRateRes",
  DEPOSIT_RES: "[wallet] depositRes",
  DEPOSIT_FEE_RES: "[wallet] depositFeeRes",
  WITHDRAW_RES: "[wallet] withdrawRes",
  WITHDRAW_LIST_RES: "[wallet] withdrawListRes",
  VCN_LIST_RES: "[wallet] vcnListRes",
  VCN_DETAIL_RES: "[wallet] vcnDetailRes",
  MERCHANT_SETTING_RES: "[wallet] merchantSettingRes",
};

export enum UserType {
  M = "Merchant",
  P = "Personal",
}

export enum DEPOSIT_STATUS {
  "0000" = "0000", // Payment is successful. Show success
  "0003" = "0003", // Transaction was not authorized
  "0004" = "0004", // Payment is pending. Show instruction
  "0008" = "0008", // Merchant refund the payment. Show instruction
  "0009" = "0009", // Redirect
  "0010" = "0010", // Need more info
  "0012" = "0012", // Authorized
}

export enum STATUS {
  "00" = "Inactive",
  "01" = "Verify",
  "02" = "Active",
}

export enum REQUESTSTATUS {
  CANCEL = "CANCEL",
  PENDING = "PENDING",
  CONFIRM = "CONFIRM",
}


export enum REDIRECTMETHOD {
  GET = "GET",
  POST = "POST"
}
