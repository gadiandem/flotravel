import { MetaData } from "./flight-list/request/meta-data";

export class PartialFlightReq {

    id: string;
    status: string;
    provider: number;
    userId:string;
    metadata: MetaData;
   
  }