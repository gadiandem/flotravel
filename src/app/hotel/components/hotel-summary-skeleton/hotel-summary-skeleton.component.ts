import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-summary-skeleton',
  templateUrl: './hotel-summary-skeleton.component.html',
  styleUrls: ['./hotel-summary-skeleton.component.css']
})
export class HotelSummarySkeletonComponent implements OnInit {
  filterOpen = true;

  constructor() { }

  ngOnInit() {
  }

}
