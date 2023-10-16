export const combineBookingConstant = {
    SEARCH_REQUEST: '[combine] searchRequest',
    SEARCH_HOTEL_LIST_REQUEST: '[combine] searchHotelRequest',
    SEARCH_HOTEL_LIST_RESPONSE: '[combine] hotelListResponse',
    SELECTED_HOTEL: '[combine] hotelSelected',
    SELECTED_HOTEL_PROVIDER: '[combine] hotelSelectedProvider',
    SELECTED_ROOM_DETAIL: '[combine] hotelRoomSelected',
    SELECTED_ROOM_DETAIL_NCT: '[combine] hotelRoomSelectedNct',
    SESSION_ID: '[combine] sessionId',
    HOTEL_AVAILABILITY: '[combine] hotelAvailabity',

    SORT_TYPE: '[combine] sortType',
    CUSTOMERS_INFO: '[combine] customerInfo',
    CARD_PAYMENT: '[combine] cardPayment',
    DEPARTURE_FLIGHT: '[combine] departureFlight',
    RETURN_FLIGHT: '[combine] returnFlight',
    NEXT_FLIGHT: '[combine] nextFlight',
    EXECUTION_ID_HAHN_AIR: '[combine] executionIdHahnAir',
    EXECUTION_ID_ET: '[combine] executionIdET',
    AIRLINE_LIST: '[combine] airlineList',
    SEARCH_FLIGHTS_FORM: '[combine] searchFlightsForm',
    SEARCH_FLIGHTS: '[combine] searchFlights',
    FLIGHT_LIST_RESULT: '[combine] flightListResult',
    OFFER_PRICE: '[combine] offerPrice',
    OFFER_PRICE_RES: '[combine] offerPriceRes',
    FLIGHT_BOOKING_DATA: '[combine] flightBookingData',
    FLIGHT_ORDER_CREATE_REQ: '[combine] flightOrderCreateReq',
    SERVICE_BOOKING_RES: '[combine] serviceBookingResult',
    FLIGHT_BSP_BOOKING: '[combine] flightBSPBooking',

    PROVIDER: '[combine] provider',
    SELECTED_PROVIDER: '[combine] providerSelected',
    CREATE_BOOKING: '[combine] aeroCreateBooking',

    CURRENCY: '[combine] currency',
    METADATA_COUNTRY: 'US',
    METADATA_CURRENCY: 'USD',
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

export const flightProvider = {
    ANY: 0,
    HAHN_AIR: 1,
    AERO_CRS: 2,
    ET: 3,
    FLO_AIR: 4,
};

export const flightSelectedProvider = {
    ANY: 0,
    HAHN_AIR: 1,
    AERO_CRS: 2,
    ET: 3,
    FLO_AIR: 4,
};
