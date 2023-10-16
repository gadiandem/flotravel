import { Component, OnInit } from '@angular/core';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-provider-footer',
  templateUrl: './provider-footer.component.html',
  styleUrls: ['./provider-footer.component.css']
})
export class ProviderFooterComponent implements OnInit {
  public appVersion = '1.1';
  public currentYear: string = DateTime.now().toFormat('y');
  constructor() { }

  ngOnInit() {
  }

}
