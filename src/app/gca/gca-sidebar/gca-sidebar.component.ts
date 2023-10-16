import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gca-sidebar',
  templateUrl: './gca-sidebar.component.html',
  styleUrls: ['./gca-sidebar.component.css']
})
export class GcaSidebarComponent implements OnInit {

  @Output()
  sortType: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  directFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  upTo1StopFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  direct: boolean;
  upTo1Stop: boolean;
  constructor() { }

  ngOnInit() {
    this.direct = false;
    this.upTo1Stop = false;
  }

  onSortChange(type: string) {
    console.log(type);
    switch (type) {
      case "priceIncrease":
        this.sortType.emit('priceIncrease')
        break;
      case "priceDecrease":
        this.sortType.emit('priceDecrease')
        break;
      case "durationIncreasing":
        this.sortType.emit('durationIncreasing')
        break;
      case "durationDecreasing":
        this.sortType.emit('durationDecreasing')
        break;
      case "departureIncreasing":
        this.sortType.emit('departureIncreasing')
        break;
      case "departureDecreasing":
        this.sortType.emit('departureDecreasing')
        break;
      case "arrivalIncreasing":
        this.sortType.emit('arrivalIncreasing')
        break;
      case "arrivalDecreasing":
        this.sortType.emit('arrivalDecreasing')
        break;
    }
  }

  onDirectFilter(){
    this.direct = !this.direct;
    this.directFilter.emit(this.direct);
  }

  onUpTo1StopFilter(){
    this.upTo1Stop = !this.upTo1Stop;
    this.upTo1StopFilter.emit(this.upTo1Stop)
  }
}
