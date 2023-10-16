import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-provider-header',
  templateUrl: './provider-header.component.html',
  styleUrls: ['./provider-header.component.css']
})
export class ProviderHeaderComponent implements OnInit {

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
