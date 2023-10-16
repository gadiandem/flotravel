import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoicing-info',
  templateUrl: './invoicing-info.component.html',
  styleUrls: ['./invoicing-info.component.css']
})
export class InvoicingInfoComponent implements OnInit {
  isCollapsed: boolean;
  editMode: boolean;
  constructor() { }

  ngOnInit() {
  }

  gotoEdit() {
    this.editMode = true;
  }
  closeEditMode() {
    this.editMode = false;
  }
}
