import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})

export class SessionService {

  private _count: number = 0;
    private _timeoutMilliseconds: number = 5000;
    private timerSubscription: Subscription;
    private timer: Observable<number>;
    private resetOnTrigger: boolean = false;
    private lastTime: number;
    private dateTimer: Observable<number>;
    private dateTimerSubscription: Subscription;
    private dateTimerInterval : number =  1000 * 60 * 40 //set session timeout to 4 minutes;
    public timeoutExpired: Subject<number> = new Subject<number>();

    constructor(
        private route: Router,
        private alertify: AlertifyService,) {
       this.timeoutExpired.subscribe(n => {
            console.log("session has started: " + n.toString());
        });

        this.startTimer();
        this.startDateCompare();
    }

    private setSubscription() {
        this.timer = timer(this._timeoutMilliseconds);
        this.timerSubscription = this.timer.subscribe(n => {
            this.timerComplete(n);
        });
    }

    private startDateCompare() {
        this.lastTime = (new Date()).getTime();
        this.dateTimer = timer(this.dateTimerInterval); // compare every five minutes
        this.dateTimerSubscription = this.dateTimer.subscribe(n => {
            let currentTime: number = (new Date()).getTime();
            if (currentTime >  this.dateTimerInterval) { // look for session expiration
                console.log("session timed out ");
                this.alertify.success('Offer has expired');
                this.dateTimerSubscription.unsubscribe();
                this.stopTimer();
                sessionStorage.clear();
                this.route.navigate(['/dashboard/hotel']);

            }

        });
    }

    public startTimer() {
        if (this.timerSubscription) {
            this.stopTimer();
        }

        this.setSubscription();
    }

    public stopTimer() {
        this.timerSubscription.unsubscribe();
        console.log("session stopped");
    }
    public endSession() {
        this.stopTimer();
    }

    public resetTimer() {
        this.startTimer();
    }

    private timerComplete(n: number) {
        this.timeoutExpired.next(++this._count);

        if (this.resetOnTrigger) {
            this.startTimer();
        }
    }

}

