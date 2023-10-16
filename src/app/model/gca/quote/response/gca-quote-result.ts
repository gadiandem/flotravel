import {TenantRes} from './tenant-res';
import {BookerRes} from './booker-res';
import {BillingRes} from './billing-res';
import {StopsRes} from './stops-res';
import {Pax} from '../../common/pax';

export class GcaQuoteResult {
  id: string;
  currency: string;
  tenant: TenantRes;
  ref_no: string;
  status: string;
  expires_on: string;
  tenant_id: {
    $oid: string;
  };
  booker: BookerRes;
  billing: BillingRes;
  journeys: Journey[];
}

export class Journey {
  flight: string;
  pax: Pax;
  stops: StopsRes;
}
