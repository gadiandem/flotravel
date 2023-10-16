import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-special-provider-header',
  templateUrl: './special-provider-header.component.html',
  styleUrls: ['./special-provider-header.component.css']
})
export class SpecialProviderHeaderComponent implements OnInit {

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
