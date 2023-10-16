import { MerchantPayment } from "../../auth/user/merchant-payment";
import { MetaData } from "../../dashboard/hotel/metadata";

export class VcnRequest {
  serviceName: string;
  sessionId: string;
  accountId: string;
  price: number;
  currency: string;
  merchantPayment: MerchantPayment;
  metadata: MetaData;
}
