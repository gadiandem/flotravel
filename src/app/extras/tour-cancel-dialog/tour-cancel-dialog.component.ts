import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tour-cancel-dialogs',
  templateUrl: './tour-cancel-dialog.component.html',
  styleUrls: ['./tour-cancel-dialog.component.css']
})
export class TourCancelDialogComponent implements OnInit {
  public event: EventEmitter<string> = new EventEmitter();
  cancellationForm: FormGroup;
  formSubmitError: boolean;
  constructor(public bsModalRef: BsModalRef,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initform();
    this.formSubmitError = false;
  }

  initform() {
    this.cancellationForm = this.fb.group({
      reason: ['']
    });
  }
  closeModal() {
    this.bsModalRef.hide();
  }
  submit() {
    // console.log('Form Submitted with value: ', this.searchForm.value);
    this.cancelHotel();
  }

  cancelHotel() {
    if (this.cancellationForm.valid) {
      const d: any = this.cancellationForm.value;
      const reason: string = d.reason;
      this.event.emit(reason);
      // sessionStorage.setItem('searchData', JSON.stringify(this.searchData));
      this.bsModalRef.hide();
    } else {
      this.formSubmitError = true;
      return;
    }
  }

}
