import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { UploadKycReq } from "src/app/model/wallet/kyc/upload-kyc-req";
import { DocumentList } from "src/app/model/wallet/kyc/document-list.res";
import { UploadKycRes } from "src/app/model/wallet/kyc/upload-kyc-res";
import { CreateCustomerReq } from "src/app/model/wallet/register/create-customer-req";
import { CreateCustomerRes } from "src/app/model/wallet/register/create-customer-res";
import { LoginReq } from "src/app/model/wallet/login/login-req";
import { LoginRes } from "src/app/model/wallet/login/login-res";
import { CustomerWithWalletReq } from "src/app/model/wallet/register/customer-with-wallet-req";

@Injectable({
  providedIn: "root",
})
export class WalletKycService {

  registerCustomerlUrl = environment.baseUrl + "wallet/user";
  registerCustomerWithWalletlUrl = environment.baseUrl + "auth/register";
  loginWalletlUrl = environment.baseUrl + "wallet/login";
  kycUploadlUrl = environment.baseUrl + "wallet/kyc";
  kycListlUrl = environment.baseUrl + "wallet/kyc";

  constructor(
    private http: HttpClient,
  ) {}

  uploadKyc(request: UploadKycReq, userId: string) {
    const headers = this.addUserIdHeader(userId);
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('name', request.name);
    formData.append('documentNumber', request.documentNumber);
    formData.append('type', request.type);
    formData.append('description', request.description);

    return this.http.post<UploadKycRes>(
      this.kycUploadlUrl, formData, { headers }
    );
  }

  fetchListkyc(userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.get<DocumentList>(
      this.kycListlUrl, { headers }
    );
  }

  register(request: CreateCustomerReq, userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.post<CreateCustomerRes>(
      this.registerCustomerlUrl, request, { headers }
    );
  }

  registerCustomerWithWallet(request: CustomerWithWalletReq) {
    return this.http.post<any>(
      this.registerCustomerWithWalletlUrl, request
    );
  }


  loginWallet(request: LoginReq, userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.post<LoginRes>(
      this.loginWalletlUrl, request, { headers }
    );
  }

  addUserIdHeader(userId: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set("user-id", `${userId}`);
    return headers;
  }
}
