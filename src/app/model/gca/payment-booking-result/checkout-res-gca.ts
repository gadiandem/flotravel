import {Trace} from '../common/trace';
import {Status} from '../common/status';

export class CheckoutResGca {
  code: string;
  message: string;
  result: ResultGca;
}

export class ResultGca {
  data: string;
  trace: Trace;
  status: Status;
}
