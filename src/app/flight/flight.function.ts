import { Flight } from "../model/flight/flight-list/flight";

export class FlightUtils {

  static decreaseDuration(a: Flight, b: Flight) {
    const depaDateA = new Date(a.depDateTime).getTime();
    const arrDateA = new Date(a.arrDateTime).getTime();
    const diffTime = Math.abs(arrDateA - depaDateA);

    const depaDateB = new Date(b.depDateTime).getTime();
    const arrDateB = new Date(b.arrDateTime).getTime();
    const diffTime2 = Math.abs(arrDateB - depaDateB);
    if(diffTime === diffTime2){
      return 0;
    }
    return diffTime < diffTime2 ? 1 : -1;
  }
}
