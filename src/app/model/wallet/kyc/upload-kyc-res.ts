import { FlocashBaseResponse } from "../flocash-base-response";
import { KycDocument } from "./kyc-document";

export class UploadKycRes extends FlocashBaseResponse {
    document: KycDocument;
}