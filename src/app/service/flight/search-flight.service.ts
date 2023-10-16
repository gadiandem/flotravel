import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SearchAirport } from 'src/app/model/flight/search-airport';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { FlightListRes } from 'src/app/model/flight/flight-list/flightListRes';
import { FlightSearchReq } from 'src/app/model/flight/flight-list/request/flightSearchReq';
import { FindAirlineReq } from 'src/app/model/flight/airline/findAirlineReq';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { MetaData } from 'src/app/model/flight/flight-list/request/meta-data';
import { OriginalDestination } from 'src/app/model/flight/flight-list/request/OriginalDestination';
import { Arrival } from 'src/app/model/flight/flight-list/request/arrival';
import { Departure } from 'src/app/model/flight/flight-list/request/departure';
import { CalendarDates } from 'src/app/model/flight/flight-list/request/calendar-dates';
import { Preference } from 'src/app/model/flight/flight-list/request/preference';
import { CabinPreferences } from 'src/app/model/flight/flight-list/request/cabin-preference';
import { FareReferences } from 'src/app/model/flight/flight-list/request/fare-references';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { Airline } from 'src/app/model/flight/airline/airline';
import { FloAir } from 'src/app/model/flight/create-floAir';

@Injectable({
  providedIn: 'root'
})
export class SearchFlightService {

  datePipeEn: DatePipe = new DatePipe('en-US');
  // private searchAirportUrl = environment.baseUrl + 'flight/flightAirports';http://18.132.92.232:8080/api/airports?keywords=Hanoi
  private searchAirportUrl = environment.baseUrl + 'ndc/airports?keywords=';
  private searchFlightUrl = environment.baseUrl + 'flight/flightList';
  private searchAvailableAirlinesUrl = environment.baseUrl + 'ndc/airlines';
  private searchAirlineUrl = environment.baseUrl + 'ndc/airlines?keywords=';
  private searchAirportByIataUrl = environment.baseUrl + 'ndc/airports/iata/';
  private floFlightUrl = environment.baseUrl + 'floair/flight';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

  searchAirport(searchTerm: string) {
    if (searchTerm.length < 3) {
      return of([]);
    }
    const searchData: SearchAirport = new SearchAirport();
    searchData.searchTerm = searchTerm;

    return this.http.get<AirportRes[]>(this.searchAirportUrl + searchTerm);
  }

  searchFlight(data: SearchFlightForm, typeFlight: string, classType: string) {
    const searchData = new FlightSearchReq();
    searchData.orgId = '';
    const metadata = new MetaData();
    metadata.country = 'ET';
    metadata.currency = 'ETB';
    metadata.locale = '';
    searchData.metadata = metadata;
    // original-destination-list
    const originDestinations: OriginalDestination[] = [];
    // origin-destination
    const originDestination = new OriginalDestination();
    // arrival
    const arrival = new Arrival();
    arrival.airportCode = 'DXB';
    originDestination.arrival = arrival;
    // departure
    const depature = new Departure();
    depature.airportCode = 'ADD';
    depature.date = '2020-11-23';
    originDestination.departure = depature;
    // add to original destination list
    originDestinations.push(originDestination);

    if (typeFlight === 'ROUND_TRIP') {
      const returnDestination = new OriginalDestination();
      // arrival
      const arrival_return = new Arrival();
      arrival_return.airportCode = 'DXB';
      returnDestination.arrival = arrival_return;
      // departure
      const depature_return = new Departure();
      depature_return.airportCode = 'ADD';
      depature_return.date = '2020-11-23';
      returnDestination.departure = depature;
      // add to original destination list
      originDestinations.push(returnDestination);
    }
    if (typeFlight === 'MULTI_CITY') {
      data.flyFromNext.forEach((f: AirportRes, index: number) => {
        const nextDestination = new OriginalDestination();
        // arrival
        const arrival_next = new Arrival();
        arrival_next.airportCode = 'DXB';
        nextDestination.arrival = arrival_next;
        // departure
        const depature_next = new Departure();
        depature_next.airportCode = 'ADD';
        depature_next.date = '2020-11-23';
        nextDestination.departure = depature;
        // add to original destination list
        // returnDestination.departure = f;
        // returnDestination.arrival = data.destinationNext[index];
        // returnDestination.departureDate = data.departuringNext[index];
        originDestinations.push(nextDestination);
      });
    }
    searchData.originalDestinations = originDestinations;
    // calendarDates property
    const calendarDates = new CalendarDates();
    calendarDates.daysBefore = 0;
    calendarDates.daysAfter = 0;
    searchData.calendarDates = calendarDates;
    // preference property
    const preference = new Preference();
    // cabin-preferences
    const cabinPreferences = new CabinPreferences();
    preference.cabinPreferences = cabinPreferences;
    // fare-references
    const fareReferences = new FareReferences();
    preference.fareReferences = fareReferences;

    searchData.preference = preference;
    // travellers property
    searchData.travellers = new Travellers();

    return this.http.post<FlightListRes>(this.searchFlightUrl, searchData);
  }

  getAirlines(){
    return this.http.get<Airline[]>(this.searchAvailableAirlinesUrl);
  }

  findAirline(searchAirline: string) {
    const searchData = new FindAirlineReq();
    searchData.iataCode = searchAirline;

    return this.http.get<Airline>(this.searchAirlineUrl);
  }

  getAirportByIata(airportCode: string) {
    return this.http.get<AirportRes>(`${this.searchAirportByIataUrl}${airportCode}`);
  }

  createFloAirFlight(request: FloAir) {
    // header
    const headers = new HttpHeaders()
      .set('environment', environment.paymentEnvironment);
    return this.http.post<FloAir>(this.floFlightUrl, request, { headers });
  }

  getFlightList() {
    // header
    const headers = new HttpHeaders();
    return this.http.get<FloAir[]>(this.floFlightUrl, { headers });
  }

  getFlight( flightId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<FloAir>(`${this.floFlightUrl}/${flightId}`, { headers });
  }

  editFlight(flight: FloAir, flightId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<FloAir>(`${this.floFlightUrl}/${flightId}`, flight, { headers });
  }

  deleteFlight(flightId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.floFlightUrl + '/' + flightId, { headers });
  }
}
