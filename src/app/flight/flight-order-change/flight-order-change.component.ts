import { Component, OnInit } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flight-order-change',
  templateUrl: './flight-order-change.component.html',
  styleUrls: ['./flight-order-change.component.css']
})
export class FlightOrderChangeComponent implements OnInit {
  sub: Subscription;

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.sub = this.store.select('flightList').subscribe((data) => {
        if(data){
          console.log(JSON.stringify(data));
        }
    });
  }

}
