import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-search-box-skeleton',
  templateUrl: './flight-search-box-skeleton.component.html',
  styleUrls: ['./flight-search-box-skeleton.component.css']
})
export class FlightSearchBoxSkeletonComponent implements OnInit {
  @Input() typeFlight: string;
  constructor() { }

  ngOnInit() {
  }

}
