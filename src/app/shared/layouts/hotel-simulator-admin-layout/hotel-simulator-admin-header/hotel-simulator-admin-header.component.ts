import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hotel-simulator-admin-header',
  templateUrl: './hotel-simulator-admin-header.component.html',
  styleUrls: ['./hotel-simulator-admin-header.component.css']
})
export class HotelSimulatorAdminHeaderComponent implements OnInit {

  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  logout() {
    // this.appService.logout();
  }
}
