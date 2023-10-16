import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.css'],
})
export class PaymentTypeComponent implements OnInit {
  paymentType: FormGroup;

  @Input() isAgent: boolean;
  @Output()
  vcnPayment: EventEmitter<boolean> = new EventEmitter<boolean>();
  isVcnPayment: boolean;
  creditCardPayment: boolean;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.creditCardPayment = environment.creditCardPayment;
    this.paymentType = this.formBuilder.group({
      radio: 'CC',
    });
    this.updateFormData();
  }

  updateFormData() {
    if (this.isAgent) {
      this.paymentType.patchValue({
        radio: 'VCN'
      });
    }
  }
  updatePaymentType(event: any) {
    this.isVcnPayment = this.paymentType.value.radio === 'VCN';
    // this.isVcnPayment = this.isAgent;
    // this.isVcnPayment = true;
    this.vcnPayment.emit(this.isVcnPayment);
  }
}
