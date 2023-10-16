import { Component, OnInit, ViewChild } from '@angular/core';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-list-configure',
  templateUrl: './list-configure.component.html',
  styleUrls: ['./list-configure.component.css']
})
export class ListConfigureComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  value: string;
  constructor() { }

  ngOnInit() {
    this.value = sessionStorage.getItem('selectedTab') || 'Hotel';
  }

  selectTab(data: TabDirective) {
    this.value = data.heading;
    sessionStorage.setItem('selectedTab',this.value);
  }
}
