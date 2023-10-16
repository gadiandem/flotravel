import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-special-package-summary-skeleton',
  templateUrl: './special-package-summary-skeleton.component.html',
  styleUrls: ['./special-package-summary-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialPackageSummarySkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
