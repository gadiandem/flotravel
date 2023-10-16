import { Component, OnInit } from '@angular/core';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent implements OnInit {
  public appVersion = '1.1';
  public currentYear: string = DateTime.now().toFormat('y');
  constructor() { }

  ngOnInit() {
  }

}
