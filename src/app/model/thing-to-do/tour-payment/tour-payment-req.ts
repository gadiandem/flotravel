import { FlocashData } from '../../flocash/flocash-data';
import { ExtrasPackage } from '../insert-tour/extras-package';
import { Schedule } from '../insert-tour/shedule';

export class TourPaymentReq {
  flocashRequest: FlocashData;
  tourData: ExtrasPackage;
  schedule: Schedule;
  userId: string;
}
