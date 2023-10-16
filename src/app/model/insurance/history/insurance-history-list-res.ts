import { FlocashPaymentInsurance } from "../subscription-policy/response/flocash-payment.insurance";

export class InsuranceHistoryListRes {
  bookingList: FlocashPaymentInsurance[];
  agentBookingList: FlocashPaymentInsurance[];
}
