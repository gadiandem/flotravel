import { Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from "@angular/router";
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { map } from "rxjs/operators";
import * as fromApp from '../../../store/app.reducer';
import { DatePipe } from '@angular/common';
import { adminConstant } from "../../userGroup-constant";
import { LogsService } from 'src/app/service/logs/logs.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlotravelLogs } from 'src/app/model/logs/flotravel-logs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlotravelLogsReq } from 'src/app/model/logs/flotravel-logs-req';
import { ModalOptions } from 'ngx-bootstrap';

@Component({
  selector: 'app-flotravel-logs-list',
  templateUrl: './flotravel-logs-list.component.html',
  styleUrls: ['./flotravel-logs-list.component.css']
})
export class FlotravelLogsListComponent implements OnInit {
  public gridData: FlotravelLogs[];
  public gridView: FlotravelLogs[];
  isLoading: boolean;
  user: UserDetail;
  logsReq : FlotravelLogsReq;
  service : string;
  formSubmitError: boolean;
  bsConfig: ModalOptions;
  searchForm: FormGroup;
  userForm: FormGroup;

    constructor(
      private logService: LogsService,
      public datePipe: DatePipe,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private store: Store<fromApp.AppState>) { }

    public ngOnInit(): void {
      this.formSubmitError = false;
      this.bsConfig = new ModalOptions();
      this.initForm();
      this.isLoading = true;
      this.store.select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
          this.user = user;
          if (this.user == null) {
            this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
          }
          if (this.user != null) {
            this.chooseComponentRender(this.user);
          }
        });
      }

      private initForm() {
        const currentDate = new Date();
        this.searchForm = new FormGroup({
          createdDate: new FormControl( currentDate, Validators.required),
          service: new FormControl('Flight', Validators.required),
        });
      }
    
   onOpenDatepicker(event: any, datepicker: any) {
        datepicker.toggle(true);
   }  
   onValueChange(value: Date): void {
    (this.searchForm.get('createdDate') as FormControl).setValue(value);
    // this.minReturnDate = value;
    const returnDate = value;
  }
    
  chooseComponentRender(accountInfo: UserDetail) {
    let isAdmin =false;

    if (accountInfo.userGroups ) {
      accountInfo.userGroups.forEach(group => {
        if(group.value === adminConstant.ADMIN || group.value === adminConstant.SADMIN){
          isAdmin = true;
        }
      })
      if(isAdmin){
        this.getFlotravelLogs();
      }
    } else {
      this.router.navigate(['edit', accountInfo.id], { relativeTo: this.activatedRoute });
    }
  }

  getFlotravelLogs() {
    this.isLoading = true;
    this.logService.getInfo(this.user.id).subscribe(
      (res: FlotravelLogs[]) => {
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'user',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'service',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'dated',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'level',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'traceId',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
  }

  viewDetail(logDetail: FlotravelLogs) {
    window.open(`#/admin/flotravelLogs/details/` + logDetail.id, '_blank');
    //const url = this.router.serializeUrl( this.router.createUrlTree(['details', logDetail.id]));
   // window.open(url, '_blank');
  }

  searchByUser(){
    this.isLoading = true;
    if (this.userForm.valid) {
      const d: any = this.userForm.value;
      let username = d.username;
      const searchRequest: FlotravelLogsReq = new FlotravelLogsReq();
      searchRequest.username = d.username;
      this.logService.getUserLogs(this.user.id, username,searchRequest).subscribe(
        (res: FlotravelLogs[]) => {
          this.gridData = res;
          this.gridView = this.gridData;
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
    } else {
    this.formSubmitError = true;
    window.scroll(0, 0);
    return;
   }
  }

  searchPackage() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchRequest: FlotravelLogsReq = new FlotravelLogsReq();
      searchRequest.service = d.service;
      searchRequest.dated = this.datePipe.transform(d.createdDate, 'dd-MM-yyyy');
      this.isLoading = true;
      this.logService.getSelectedLog(this.user.id, searchRequest).subscribe(
        (res: FlotravelLogs[]) => {
          this.gridData = res;
          this.gridView = this.gridData;
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
      } else {
        this.formSubmitError = true;
        window.scroll(0, 0);
        return;
      }
  }

}
