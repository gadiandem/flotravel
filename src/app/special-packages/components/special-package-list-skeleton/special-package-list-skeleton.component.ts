import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-special-package-list-skeleton',
  templateUrl: './special-package-list-skeleton.component.html',
  styleUrls: ['./special-package-list-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialPackageListSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
