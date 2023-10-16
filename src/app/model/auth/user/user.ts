import { CurrencyNewRes } from '../../dashboard/currency/currency-new-res.model';
import { Agent } from '../agency/agency';
import { FlightSupplier } from '../agency/supplier';
import { MerchantPayment } from './merchant-payment';
import { WalletCredential } from './wallet-credential';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  email: string;
  mobile: string;
  currency: CurrencyNewRes;
  password: string;
  created: string;
  createdby: number;
  updated: string;
  updatedby: number;
  expired: boolean;
  locked: boolean;
  userGroupIds: string[];
  passwordExpired: boolean;
  enabled: boolean;
  agentId?: string;

  merchantPayment: MerchantPayment;
  // constructor(public email: string, public userToken: string) { }
  apiUser: string;
  apiPassword: string;
  // wallet info
  walletCredential: WalletCredential;
  active: boolean;

  //supplier-info
  flightProvider : FlightSupplier[];
  selectedFlightProvider : string[];


}

