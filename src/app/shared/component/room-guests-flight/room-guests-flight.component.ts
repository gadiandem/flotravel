import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room-guests-flight',
  templateUrl: './room-guests-flight.component.html',
  styleUrls: ['./room-guests-flight.component.css']
})
export class RoomGuestsFlightComponent implements OnInit {
  @Input() adultNumber: number;
  @Input() childrenNumber: number;
  @Input() infantsNumber: number;

  @Output() adultNumberNew: EventEmitter<number> = new EventEmitter<number>();
  @Output() childrenNumberNew: EventEmitter<number> = new EventEmitter<number>();
  @Output() showDropDown: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() infantsNumberNew: EventEmitter<number> = new EventEmitter<number>();
  isShowDropDown: boolean;
  constructor() { }

  ngOnInit() {
    this.isShowDropDown = true;
  }

  updatePassenger() {
    this.isShowDropDown = false;
    this.showDropDown.emit(this.isShowDropDown);
    this.adultNumberNew.emit(this.adultNumber);
    this.childrenNumberNew.emit(this.childrenNumber);
    this.infantsNumberNew.emit(this.infantsNumber)
  }

  increase(type: string) {
    if(type === 'children') {
      if (this.childrenNumber < 6) {
        this.childrenNumber++;
      }
    } else if (type === 'adult'){
      if (this.adultNumber < 6) {
        this.adultNumber++
      }
    } else {
      if (this.infantsNumber < 6) {
        this.infantsNumber++
      }
    }
  }

  decrease(type: string) {
    if(type === 'children') {
      if (this.childrenNumber > 0) {
        this.childrenNumber--;
      }
    } else if (type === 'adult'){
      if (this.adultNumber > 0) {
        this.adultNumber--;
      }
    } else {
      if (this.infantsNumber > 0) {
        this.infantsNumber--;
      }
    }
  }
}
