import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-special-package-list-item',
  templateUrl: './special-package-list-item.component.html',
  styleUrls: ['./special-package-list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialPackageListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
