import { FloAirFlightSegment } from "./flo-air-flight-segment";

export class FloAir {
    id: string;
    airline: string;
    airlineid: number;
    flightid: string;
    fromcode: string;
    tocode : string;
    from: string;
    to: string;
    depart: string;
    arrive: string
    tax: string;
    currency:string;
    depCityName: string;
    depCountry: string;
    arrCityName: string;
    arrCountry: string;
    aircraft: string;
    flightNumber : string;
    flightClass: string;
    flightType: string;
    fareAdult: string;
    fareChild: string;
    fareInfant: string;
    basicFare: string;
    totalFare: string;
    totalTax: string;
    duration: string;
    totalQuantity: number;
    maximumWeight: number;
    stopCode: string;
    stop: string;
    stopCityName: string;
    stopCountry: string;
    stopDepart: string;
    stopArrive: string;
    flightSegment: FloAirFlightSegment[];
  }