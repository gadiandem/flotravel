export const appConstant = {
  ACCOUNT_INFO: 'accountInfo',
  CURRENCY: 'currency',
  DEMO: 'demo',
  AGENT_VCN: 'agentVcn',
  OTP_RES: 'otpRes',
  paymentInfo: '[vcn] paymentInfo',
  FLIGHT_PAYMENT_INFO: '[app] flighPaymentInfo',
  PAY_HOLD_BOOKING_REQ: '[app] flighPaymentInfo',
  OTP_ERROR_MESSAGE: 'otpErrorMessage',
  TERMS_AND_CONDITIONS: '/#/termsAndCondition',
  REDIRECT: '[app] redirect',
  REDIRECT_SERVICE_NAME: '[app] serviceName',
  COUNTRY: 'country',
  CURRENT_LOCATION: 'currentLocation',
  HOTEL_SIMULATOR_SUPPLIER: '[app] hotelSimulatorSupplier',
  FLIGHT_SIMULATOR_SUPPLIER: '[app] flightSimulatorSupplier',
  TRANSACTION_ID: 'traceId',
};

export const appDefaultData = {
  DEFAULT_CURRENCY: 'USD'
};

export const serviceName = {
  FLOTRAVEL_SERVICE: 'FLOTRAVEL_SERVICE',
  NUITEE: 'NUITEE',
  HAHN_AIR: 'HAHN_AIR',
  AEROCRS: 'AEROCRS',
  ET: 'ET',
  AXA: 'AXA',
  TRACE_ME: 'TRACE_ME',
  GCA: 'GCA',
  NCT: 'NCT',
  HOTEL_COLLECTION: 'SPECIAL_PACKAGE'
};

export const supplierType = {
  HOTEL: 'Hotel',
  FLIGHT: 'Flight'
};

export const supplierSimulatorOption = {
  ENABLE: 'enable',
  DISABLE: 'disable'
};

export const supplierEnableOption = {
  ENABLE: 'enable',
  DISABLE: 'disable'
};

export const defaultData = {
  noImage: './assets/no-image.png',
  aeroAirlineLogo: 'https://storage.aerocrs.com/375/system/LogoAPI.png',
  lat: 39.56860,
  lng: 2.63042,
  rate: 4.5,
  hotelRoomImageCount: 5
};

export enum FLOCASH_CREATE_ORDER_STATUS {
  '0000' = '0000', // Payment is successful. Show success
  '0003' = '0003', // Transaction was not authorized
  '0004' = '0004', // Payment is pending. Show instruction
  '0008' = '0008', // Merchant refund the payment. Show instruction
  '0009' = '0009', // Redirect
  '0010' = '0010', // Need more info
  '0012' = '0012', // Authorized
}

export enum REQUESTSTATUS {
  CANCEL = 'CANCEL',
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRM',
}

export enum BOOKINGSTATUS {
  CANCEL = 'CANCEL',
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRMED',
  FAIL = 'FAIL',
}

export enum REDIRECTMETHOD {
  GET = 'GET',
  POST = 'POST'
}

export enum SERVICENAME {
  TRACEME = 'TRACE_ME',
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  HEPSTAR = 'HEPSTAR',
  GCA = 'GCA',
  NCT = 'NCT',
  INSURANCE = 'INSURANCE',
  PACKAGE = 'PACKAGE',
  SPECIAL_PACKAGE = 'SPECIAL_PACKAGE'
}

export const linkUrl = {
  localhost: 'http://localhost:4200/#/',
  fannos: 'https://fannos.flocash.com/#/'
};

export const SESSION_TIMEOUT = 20 * 60 * 1000;
