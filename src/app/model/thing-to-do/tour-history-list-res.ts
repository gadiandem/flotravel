import { PaymentTour } from './tour-payment/tour-payment-res/payment-tour';

export class TourHistoryListRes {
  bookingList: PaymentTour[];
  agentBookingList: PaymentTour[];
}
