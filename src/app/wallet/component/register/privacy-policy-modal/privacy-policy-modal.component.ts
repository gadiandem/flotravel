import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy-modal',
  templateUrl: './privacy-policy-modal.component.html',
  styleUrls: ['./privacy-policy-modal.component.css']
})
export class PrivacyPolicyModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,public translate: TranslateService) { 
    translate.setDefaultLang ('en');
      translate.use('en');;
  }

  ngOnInit() {
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
