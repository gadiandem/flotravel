import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-hotel-simulator-admin-footer',
  templateUrl: './hotel-simulator-admin-footer.component.html',
  styleUrls: ['./hotel-simulator-admin-footer.component.css']
})
export class HotelSimulatorAdminFooterComponent implements OnInit {
  public appVersion = '1.1';
  public currentYear: string = DateTime.now().toFormat('y');
  constructor() { }

  ngOnInit() {
  }

}
