import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoomGuest } from '../../../model/dashboard/hotel/room-guest';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-room-guests',
  templateUrl: './room-guests.component.html',
  styleUrls: ['./room-guests.component.css']
})
export class RoomGuestsComponent implements OnInit {
  searchForm: FormGroup;
  @Input() roomGuests: RoomGuest[];
  @Output() showDropDown: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() roomGuestsNew: EventEmitter<RoomGuest[]> = new EventEmitter<RoomGuest[]>();
  adults: number[] = [];
  children: number[] = [];
  isShowDropDown: boolean;
  @Output() formValid = new EventEmitter<boolean>();
  roomGuestsUpdate: RoomGuest[] = [];
  constructor() { }

  ngOnInit() {
    this.isShowDropDown = true;
    this.initForm();
    this.updateValue();
    this.searchForm.statusChanges
      .pipe(
        filter(() => this.searchForm.invalid))
      .subscribe(() => this.onFormValid());
  }

  private initForm() {
    this.searchForm = new FormGroup({
      rooms: new FormArray([]),
    });
  }

  updateValue() {
    if (this.roomGuests) {
      this.roomGuests.forEach(
        (r: RoomGuest) => {
          this.adults.push(r.adult);
          this.children.push(r.children);
          this.updateRoom(r);
        }
      );
    } else {
      this.onAddRoom();
    }
  }

  updateRoom(item: RoomGuest) {
    (this.searchForm.get('rooms') as FormArray).push(
      new FormGroup({
        adult: new FormControl(item.adult),
        children: new FormControl(item.children)
      })
    );
  }

  get roomsControls() {
    return (this.searchForm.get('rooms') as FormArray).controls;
  }

  onAddRoom() {
    (this.searchForm.get('rooms') as FormArray).push(
      new FormGroup({
        adult: new FormControl(1),
        children: new FormControl(0)
      })
    );
    this.adults.push(1);
    this.children.push(0);
  }

  removeItem(index: number) {
    setTimeout(() => {
      (this.searchForm.get('rooms') as FormArray).removeAt(index);
      this.adults.splice(index, 1);
      this.children.splice(index, 1);
    }, 50);
  }

  private onFormValid() {
    this.formValid.emit(this.searchForm.valid);
  }

  add(index: number, category: string) {
    if ('adult' === category) {
      if (this.adults[index] < 6) {
        this.adults[index]++;
      }
    } else {
      if (this.children[index] < 6) {
        this.children[index]++;
      }
    }
  }

  subtract(index: number, category: string) {
    if ('adult' === category) {
      if ( this.adults[index] > 0) {
        this.adults[index]--;
      }
    } else {
      if (this.children[index] > 0) {
        this.children[index]--;
      }
    }
  }
  updateRoomGuests() {
    this.adults.forEach((data, index) => {
      const roomGuest: RoomGuest = new RoomGuest();
      roomGuest.adult = this.adults[index];
      roomGuest.children = this.children[index];
      this.roomGuestsUpdate.push(roomGuest);
    });
    this.isShowDropDown = false;
    this.showDropDown.emit(this.isShowDropDown);
    this.roomGuestsNew.emit(this.roomGuestsUpdate);
  }
}
