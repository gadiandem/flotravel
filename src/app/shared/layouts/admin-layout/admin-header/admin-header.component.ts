import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
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
