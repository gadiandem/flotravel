import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(public translate: TranslateService) { 
    translate.setDefaultLang ('en');
    translate.use('en');;
  }
  
  ngOnInit() {
  }
}
