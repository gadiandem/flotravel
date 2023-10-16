import { FlocashBaseResponse } from "../flocash-base-response";
import { KycDocument } from "./kyc-document";

export class DocumentList extends FlocashBaseResponse {
  documents: KycDocument[];
}
