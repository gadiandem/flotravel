import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(
    public translate: TranslateService ) {
    translate.setDefaultLang ('en');
    translate.use('en');
  }

  ngOnInit() {
  }

}
