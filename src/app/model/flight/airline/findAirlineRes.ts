import { Airline } from './airline';

export class FindAirlineRes {
  error: string;
  status: string;
  message: string;
  airline: Airline[];
}
