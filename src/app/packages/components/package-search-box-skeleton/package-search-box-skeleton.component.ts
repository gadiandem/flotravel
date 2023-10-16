import { Component, Input, OnInit } from '@angular/core';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';

@Component({
  selector: 'app-package-search-box-skeleton',
  templateUrl: './package-search-box-skeleton.component.html',
  styleUrls: ['./package-search-box-skeleton.component.css']
})
export class PackageSearchBoxSkeletonComponent implements OnInit {
  @Input() packageShoppingReq: PackageShoppingReq;

  constructor() { }

  ngOnInit() {
  }

}
