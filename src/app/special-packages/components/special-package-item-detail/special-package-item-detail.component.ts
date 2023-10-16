import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-special-package-item-detail',
  templateUrl: './special-package-item-detail.component.html',
  styleUrls: ['./special-package-item-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialPackageItemDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
