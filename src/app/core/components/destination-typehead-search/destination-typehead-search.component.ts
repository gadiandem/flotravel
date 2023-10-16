import {Component, forwardRef, Input, OnInit, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from '@angular/forms';
import {Observable, Observer, of} from 'rxjs';
import {DestinationRes} from '../../../model/dashboard/desRes.model';
import {DestinationSelect} from '../../../model/common/destination-select';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {DashboardService} from '../../../service/dashboard/dashboard.service';

@Component({
  selector: 'app-destination-typehead-search',
  templateUrl: './destination-typehead-search.component.html',
  styleUrls: ['./destination-typehead-search.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DestinationTypeheadSearchComponent)
    }
  ]
})
export class DestinationTypeheadSearchComponent implements  OnInit, ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() formSubmitError = false;
  @Input() errors: ValidationErrors;
  suggestions$: Observable<DestinationRes[]>;
  search = '';
  limit: number;
  touched = false;
  value: string;
  destinationSelect: DestinationSelect;
  constructor(protected dashboardService: DashboardService, ) {
  }
  onChange = (v) => {
    return v;
  }
  onTouched = () => { return; };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  handleChange() {
    this.onChange(this.value);
  }
  ngOnInit(): void {
  }
  select(des: any) {
    this.destinationSelect.destinationName = des.displayName;
    this.destinationSelect.cityCode = des.id;
  }
  selectResidenceCountry(country: any) {
    this.value = country.code;
  }
  searchDestination() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          return this.dashboardService.getDestination(this.search).pipe(
            map((data: DestinationRes[]) => {
              return data || [];
            }),
            tap( err => {
              // in case of http error
              this.limit = 0;
            })
          );
        }
        return of([]);
      })
    );
  }
}
