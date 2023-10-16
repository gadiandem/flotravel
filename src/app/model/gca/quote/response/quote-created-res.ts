import {GcaQuoteResult} from './gca-quote-result';

export class QuoteCreatedRes {
  code: string;
  message: string;
  gcaQuoteResult: GcaQuoteResult;
  xgactraceId: string;
}
