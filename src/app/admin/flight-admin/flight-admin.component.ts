import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FloAir } from 'src/app/model/flight/create-floAir';
import { appConstant } from 'src/app/app.constant';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-flight-admin',
  templateUrl: './flight-admin.component.html',
  styleUrls: ['./flight-admin.component.css']
})
export class FlightAdminComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: FloAir[];
  public gridView: FloAir[];
  isLoading = false;
  user: UserDetail;
  public mySelection: string[] = [];

  constructor(private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private searchFlightService: SearchFlightService) { }

  ngOnInit() {

    this.gridData = [];
    this.gridView = [];
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        } else {
          this.fetchFlightList();
        }
    });
  }

  fetchFlightList(){
    this.isLoading = true;
    this.searchFlightService.getFlightList().subscribe(
      (res: FloAir[]) => {
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }
  createFlight(){
    this.router.navigate(["../create"], { relativeTo: this.activeRoute });
  }
  editFlight(flightDetail: FloAir) {
    this.router.navigate(['../edit/', flightDetail.id], { relativeTo: this.activeRoute });
  }
  deleteRecord(flightItem: FloAir) {
    this.alertify.confirm('Are you sure you want to delete this flight?', () => {
      this.searchFlightService.deleteFlight(flightItem.id, this.user.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.fetchFlightList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [

          {
            field: 'airline',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'from',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'to',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'totalFare',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'flightClass',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'flightType',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

}
