import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Airline } from 'src/app/model/flight/airline/airline';

@Component({
  selector: 'app-flight-sidebar',
  templateUrl: './flight-sidebar.component.html',
  styleUrls: ['./flight-sidebar.component.css']
})
export class FlightSidebarComponent implements OnInit {
  
  @Input()
  arilines: string[];
  @Output()
  sortType: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  directFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  upTo1StopFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  earlyMorningDepatureFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  morningDepatureFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  afternoonDepatureFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  eveningDepatureFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  earlyMorningArrivalFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  morningArrivalFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  afternoonArrivalFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  eveningArrivalFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  airlinesFilter: EventEmitter<string[]> = new EventEmitter<string[]>();

  direct: boolean;
  upTo1Stop: boolean;

  earlyMorningDepature: boolean;
  morningDepature: boolean;
  afternoonDepature: boolean;
  eveningDepature: boolean;
  earlyMorningArrival: boolean;
  morningArrival: boolean;
  afternoonArrival: boolean;
  eveningArrival: boolean;

  airlinesForm: FormGroup;
  selectedAirline: string[];
  constructor() { }

  ngOnInit() {
    this.direct = false;
    this.upTo1Stop = false;
    this.initAirlineForm();
    this.updateFormValue();
    
    this.airlinesForm.valueChanges.subscribe(v => {
      this.selectedAirline = [];
      (v.airlines as Array<boolean>).forEach((selected, i) => {
        if(selected){
          this.selectedAirline.push(this.arilines[i]);
        }
      })
      this.airlinesFilter.emit(this.selectedAirline);
    })
  }
  updateFormValue() {
    if(this.arilines){
      this.arilines.forEach(airline => {
        this.onAddAirline(airline);
      })
    };
  }
  initAirlineForm() {
    this.airlinesForm = new FormGroup({
      airlines: new FormArray([])
    });
  }

  get airlinesControls() {
    return (this.airlinesForm.get('airlines') as FormArray).controls;
  }

  onAddAirline(airline: string) {
    (this.airlinesForm.get('airlines') as FormArray).push(new FormControl(true));
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

  onEarlyMorningDepatureFilter(){
    this.earlyMorningDepature = !this.earlyMorningDepature;
    this.earlyMorningDepatureFilter.emit(this.earlyMorningDepature)
  }
  onMorningDepatureFilter(){
    this.morningDepature = !this.morningDepature;
    this.morningDepatureFilter.emit(this.morningDepature)
  }
  onAfternoonDepatureFilter(){
    this.afternoonDepature = !this.afternoonDepature;
    this.afternoonDepatureFilter.emit(this.afternoonDepature)
  }
  onEveningDepatureFilter(){
    this.eveningDepature = !this.eveningDepature;
    this.eveningDepatureFilter.emit(this.eveningDepature)
  }
  onEarlyMorningArrivalFilter(){
    this.earlyMorningArrival = !this.earlyMorningArrival;
    this.earlyMorningArrivalFilter.emit(this.earlyMorningArrival)
  }
  onMorningArrivalFilter(){
    this.morningArrival = !this.morningArrival;
    this.morningArrivalFilter.emit(this.morningArrival)
  }
  onAfternoonArrivalFilter(){
    this.afternoonArrival = !this.afternoonArrival;
    this.afternoonArrivalFilter.emit(this.afternoonArrival)
  }
  onEveningArrivalFilter(){
    this.eveningArrival = !this.eveningArrival;
    this.eveningArrivalFilter.emit(this.eveningArrival)
  }

  onSelectAirlineUpdate(index: number){
    console.log('select item: ' + index);
  }
}
