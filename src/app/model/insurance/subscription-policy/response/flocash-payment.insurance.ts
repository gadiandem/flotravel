import { User } from "src/app/model/auth/user/user";
import { FlocashOrderResponse } from "src/app/model/flocash/response/flocash-order.response";
import { InsuranceTravel } from "../../quote/insurance-travel";

export class FlocashPaymentInsurance extends FlocashOrderResponse {
  id: string;
  userId: string;
  accountBooking: string;
  user: User;
  agent : string;
  guaranteeDetails :string;
  //insurance data
  price: any;
  payment: any;
  subscriptionStatus: any;
  attachments: any[];
  subscriptionCountry: string;
  quoteCode: string;
  agentScope: string;
  policyHolder: any;
  policyNumber: string;
  policyId: string;
  draftPolicyNumber: string;
  // search quote data
  context: any;
  productCriteria: any;
  travel: InsuranceTravel;
  productCode: string;
  guarantees: any[];
  // payment Tariff
  paymentTariff: any;
  token: string;
  // cancel data
  insuranceCancellationAmount: number;
  insuranceRefundAmount: number;
  deleted: boolean;
  createDate: string;
  updateDate: string;
}
