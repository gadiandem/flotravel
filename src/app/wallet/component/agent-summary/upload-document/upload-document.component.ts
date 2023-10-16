import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from "@angular/common";

import { AlertifyService } from 'src/app/service/alertify.service';
import { WalletKycService } from 'src/app/service/wallet/kyc.service';
import { UploadKycReq } from 'src/app/model/wallet/kyc/upload-kyc-req';
import { UploadKycRes } from 'src/app/model/wallet/kyc/upload-kyc-res';
import { FileValidator } from 'src/app/shared/validator/file.validator';

interface Type {
  id: string;
  name: string;
}

const typeList: Type[] = [
  {
    id: 'B',
    name: 'Bank Statement',
  },
  {
    id: 'N',
    name: 'National ID',
  },
  {
    id: 'P',
    name: 'Passport',
  },
  {
    id: 'U',
    name: 'Utility Bill',
  },
  {
    id: 'O',
    name: 'Others',
  }
];

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {
  isCollapsed: boolean;

  account: UserDetail;
  initialLoadData = true;
  
  formSubmitError: boolean;
  uploadDocumentForm: FormGroup;
  types: Type[];

  fileToUpload: File | null = null;
  constructor(private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private _location: Location,
    private walletKycService: WalletKycService) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (!this.account) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
    this.initForm();
    this.types = typeList;
  }


  initForm() {
    this.uploadDocumentForm = this.fb.group({
      documentNumber: ["", Validators.required],
      documentName: ["", Validators.required],
      description: ["", Validators.required],
      type: ["", Validators.required],
      file: ["",{ validators: [Validators.required], updateOn: 'blur'}],
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileToUpload.size
}

  upload() {
    if (this.uploadDocumentForm.valid) {
      const d = this.uploadDocumentForm.value;
      const uploadKyc = new UploadKycReq();
      uploadKyc.documentNumber = d.documentNumber;
      uploadKyc.name = d.documentName;
      uploadKyc.description = d.description;
      uploadKyc.type = d.type;
      uploadKyc.file = this.fileToUpload;
      this.walletKycService.uploadKyc(uploadKyc, this.account.id).subscribe(
        (res: UploadKycRes) => {
          if(res.document){
            this.alertify.success(`Upload kyc: ${res.document.name} success:!!!`);
            this._location.back();
          } else {
            this.alertify.error(`Upload kyc: ${res.errorId} - ${res.errorCode} - ${res.errorMessage} Error:!!!`);
          }
        }, e => {
          this.alertify.error(`Upload kyc Error ${e.error}`);
        }
      )
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
  cancel(){
    this._location.back();
  }
}
