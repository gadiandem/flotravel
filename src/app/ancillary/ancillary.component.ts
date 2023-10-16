import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ancillary',
  templateUrl: './ancillary.component.html',
  styleUrls: ['./ancillary.component.css']
})
export class AncillaryComponent implements OnInit {

  constructor(public translate: TranslateService) { 
    translate.setDefaultLang ('en');
    translate.use('en');;
  }

  ngOnInit() {
    
  }

}
