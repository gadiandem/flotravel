import { Component, OnInit } from '@angular/core';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-special-provider-footer',
  templateUrl: './special-provider-footer.component.html',
  styleUrls: ['./special-provider-footer.component.css']
})
export class SpecialProviderFooterComponent implements OnInit {
  public appVersion = '1.1';
  public currentYear: string = DateTime.now().toFormat('y');
  constructor() { }

  ngOnInit() {
  }

}
