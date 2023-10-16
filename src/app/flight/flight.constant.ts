export const flightConstant = {
    FLIGHT_TYPE: '[flight] flightType',
    SORT_TYPE: '[flight] sortType',
    CUSTOMERS_INFO: '[flight] customerInfo',
    CARD_PAYMENT: '[flight] cardPayment',
    DEPARTURE_FLIGHT: '[flight] departureFlight',
    RETURN_FLIGHT: '[flight] returnFlight',
    NEXT_FLIGHT: '[flight] nextFlight',
    EXECUTION_ID: '[flight] executionId',
    AIRLINE_LIST: '[flight] airlineList',
    SEARCH_FLIGHTS: '[flight] searchFlights',
    FLIGHT_LIST_RESULT: '[flight] flightListResult',
    OFFER_PRICE: '[flight] offerPrice',
    OFFER_PRICE_RES: '[flight] offerPriceRes',
    FLIGHT_BOOKING_DATA: '[flight] flightBookingData',
    FLIGHT_ORDER_CREATE_REQ: '[flight] flightOrderCreateReq',
    FLIGHT_BOOKING_RES: '[flight] flightBookingResult',
    FLIGHT_SEVICES_RES: '[flight] serviceListRS',
    SELECTED_FLIGHT_SEVICES: '[flight] selectedServiceList',
    FLIGHT_HOLD_BOOKING_RES: '[flight] flightHoldBookingResult',
    PARTIAL_FLIGHT_BOOKING_RES: '[flight] flightPartialBookingResult',
    FLIGHT_BSP_BOOKING: '[flight] flightBSPBooking',
    FLIGHT_CHANGE: '[flight] orderChange',

    HAHNAIR_PROVIDER: '[flight] hahnairProvider',
    ET_PROVIDER: '[flight] etProvider',
    AEROCRS_PROVIDER: '[flight] aeroCRSProvider',
    FLOAIR_PROVIDER: '[flight] floAirProvider',
    QR_PROVIDER: '[flight] qrProvider',

    PROVIDER: '[flight] provider',
    PROVIDERS: '[flight] flightProviders',
    SELECTED_PROVIDER: '[flight] providerSelected',
    CREATE_BOOKING: '[flight] aeroCreateBooking',
    ADD_ON_REFUND_PROTECT: '[flight] add-on-refund-protect',
    ADD_ON_TRACEME: '[flight] add-on-traceme',
    ADD_ON_INSURANCE: '[flight] add-on-axa-insurance',
    ADD_ON_SMART_DELAY: '[flight] add-on-smart-delay',
    ADD_ON_GCA: '[flight] add-on-gca',

    ADD_ON_GCA_DEPARTURE_TERMINAL: '[flight] add-on-gca-departure-terminal',
    ADD_ON_GCA_ARRIAVEL_TERMINAL: '[flight] add-on-gca-arrival-terminal',
    ADD_ON_GCA_DEPARTURE_SERVICES: '[flight] add-on-gca-departure-services',
    ADD_ON_GCA_ARRIVAL_SERVICES: '[flight] add-on-gca-arrival-services',

    ADD_ON_PRICE_REFUND_PROTECT: '[flight] add-on-price-refund-protect',
    ADD_ON_PRICE_SMART_DELAY: '[flight] add-on-price-smart-delay',

    FLIGHT_DETAIL: '[flight] flightDetail',
    FLIGHT_VCN_GENERATE: '[flight] vcnGenerateReq',
  COOKIES_FLY_FROM: '[flight] cookiesFlyFrom',
  COOKIES_FLY_TO: '[flight] cookiesFlyTo',

  CITY_FROM: '[flight] cityFrom',
  CITY_ARRIVAL: '[flight] cityArrival'
};

export const flightTypeValue = {
    ONE_WAY: 'ONE_WAY',
    ROUND_TRIP: 'ROUND_TRIP',
    MULTI_CITY: 'MULTI_CITY'
};

export const flightTypeIndex = {
    ONE_WAY: 1,
    ROUND_TRIP: 2,
    MULTI_CITY: 3
};

export const flightListType = {
  DEPARTURE: 1,
  RETURNING: 2
};

export const demoFlightData = {
    COUNTRY: 'ET',
    CURRENCY: 'USD',
    EXECUTION_ID: 'e1s1'
};

export const classType = {
    First: '1',
    Business: '2',
    Economy: '3',
    PremiumEconomy: '4',
    Economy2: '5',
    Economy3: '6',
    AnyCabin: '7'
};

export const orderChangeType = {
  DEFERRED_PAYMENT: 1,
  PARTIAL_CHANGE: 2,
  ADD_SERVICE: 3,
  ORDER_SPLIT : 4,
  FULL_CHANGE: 5,
};

export const flightProvider = {
    ANY: 0,
    HAHN_AIR: 1,
    AERO_CRS: 2,
    ET: 3,
    FLO_AIR : 4,
    QR : 5
};

export const flightProviders = [
   {
      id: 0,
      name: 'ANY',
   },
   {
    id: 1,
    name: 'HAHN_AIR',
  },
  {
    id: 2,
    name: 'AERO_CRS',
  },
  {
    id: 3,
    name: 'ET',
  },
  {
    id: 4,
    name: 'FLO_AIR',
  } ,
  {
    id: 5,
    name: 'QR',
  }
];

export enum flightProviderName {
  HahnAir,
  ET,
  AeroCRS,
  FloAir,
  QR
}

export const flightSelectedProvider = {
    ANY: 0,
    HAHN_AIR: 1,
    AERO_CRS: 2,
    ET: 3,
    FLO_AIR : 4,
    QR : 5
};

export const typeFlightData =  [
  {
    id: '1',
    text: 'One way'
  },
  {
    id: '2',
    text: 'Return'
  },
  {
    id: '3',
    text: 'Multi-city'
  }
];

export const economyData =  [
  {
    id: '7',
    text: 'Any Cabin'
  },
  {
    id: '1',
    text: 'First Class'
  },
  {
    id: '2',
    text: 'Business Class'
  },
  {
    id: '3',
    text: 'Economy class'
  },
  {
    id: '4',
    text: 'Premium Economy'
  }
];

export const moreOptionData =  [
  {
    id: '1',
    text: 'Any airline'
  },
  {
    id: '2',
    text: 'Aegean'
  },
  {
    id: '3',
    text: 'Aeroflot-Russian Airlines'
  },
  {
    id: '4',
    text: 'Aer Lingus'
  },
  {
    id: '5',
    text: 'Aeromexico'
  },
  {
    id: '6',
    text: 'Afriqiyah'
  },
  {
    id: '7',
    text: 'Air Algerie'
  },
  {
    id: '8',
    text: 'Air Arabia Maroc'
  },
  {
    id: '9',
    text: 'Air Astana'
  }
];

export const months =  [
  {
    id: '1',
    text: 'January'
  },
  {
    id: '2',
    text: 'Febuary'
  },
  {
    id: '3',
    text: 'March'
  },
  {
    id: '4',
    text: 'April'
  },
  {
    id: '5',
    text: 'May'
  },
  {
    id: '6',
    text: 'June'
  },
  {
    id: '7',
    text: 'July'
  },
  {
    id: '8',
    text: 'August'
  },
  {
    id: '9',
    text: 'September'
  },
  {
    id: '10',
    text: 'October'
  },
  {
    id: '11',
    text: 'November'
  },
  {
    id: '12',
    text: 'December'
  }
];
