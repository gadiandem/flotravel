import { Component, OnInit } from '@angular/core';
import { FlotravelLogs } from 'src/app/model/logs/flotravel-logs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { LogsService } from 'src/app/service/logs/logs.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';

@Component({
  selector: 'app-flotravel-logs-detail',
  templateUrl: './flotravel-logs-detail.component.html',
  styleUrls: ['./flotravel-logs-detail.component.css']
})
export class FlotravelLogsDetailComponent implements OnInit {

  logId: string;
  logDetail: FlotravelLogs;
  isLoading = false;
  user: UserDetail;
  bsModalRef: BsModalRef;
  
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private logService: LogsService,
    private modalService: BsModalService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.logDetail = new FlotravelLogs();
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.activeRoute.params.subscribe((params: Params) => {
      this.logId = params['logId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.logService.getLogDetail(this.user.id, this.logId).subscribe(
          (res: FlotravelLogs) => {
            this.logDetail = res;
            this.isLoading = false;
          }, e => {
            this.isLoading = false;
          }
        );
      } else {
        this.router.navigate(['/login']);
      }

    });
  }

}
