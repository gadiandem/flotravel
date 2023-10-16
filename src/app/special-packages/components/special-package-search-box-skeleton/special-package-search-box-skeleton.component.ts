import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-special-package-search-box-skeleton',
  templateUrl: './special-package-search-box-skeleton.component.html',
  styleUrls: ['./special-package-search-box-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialPackageSearchBoxSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
