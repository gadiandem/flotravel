import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css']
})
export class TransactionsHistoryComponent implements OnInit {

  constructor(public translate: TranslateService) { 
    translate.setDefaultLang ('en');
    translate.use('en');;
  }

  ngOnInit() {
  }

}
