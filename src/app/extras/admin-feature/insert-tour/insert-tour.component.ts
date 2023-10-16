import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, of, Observer } from 'rxjs';
import { filter, tap, switchMap, map } from 'rxjs/operators';

import { TourInsertService } from 'src/app/service/extras/tour-insert.service';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { TourListService } from 'src/app/service/extras/tour-list.service';
import { Schedule } from 'src/app/model/thing-to-do/insert-tour/shedule';
import { appConstant } from 'src/app/app.constant';
import { thingToDoConstant } from '../../thing-to-do.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';

@Component({
  selector: 'app-insert-tour',
  templateUrl: './insert-tour.component.html',
  styleUrls: ['./insert-tour.component.css']
})
export class InsertTourComponent implements OnInit {

  insertForm: FormGroup;
  currencies: CurrencyNewRes[];
  tourId: string;
  extrasPackage: ExtrasPackage;

  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  minDateStart: Date;
  model: any;
  searching = false;
  searchFailed = false;
  
  destinationName: string;
  cityCode: string;
  insertMode = true;
  constructor(protected router: Router,
    protected dashboardService: DashboardService,
     private tourInsertService: TourInsertService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private tourService: TourListService) { }

  ngOnInit() {
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.fetchTourDetail();
    this.searchDestination();
  }
  fetchTourDetail() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.tourId = params['tourId'];
      if(this.tourId){
        this.insertMode = false;
      }
    });
    if (this.tourId != null) {
      this.tourService.getExtrasPackageDetail(this.tourId).subscribe(
        (res: ExtrasPackage) => {
          // console.log('!!!!! ' + res.status);
          if(res){
            sessionStorage.setItem(thingToDoConstant.TOUR_EDIT, JSON.stringify(res));
            this.extrasPackage = res;
            this.initFormWithData();
          }
        }
      );
    }

  }
  private initForm() {
    this.insertForm = this.fb.group({
      id: [''],
      name: ['',[ Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      // destination: [''],
      title: [''],
      description: ['', Validators.required],
      shortDescription: [''],
      duration: ['', Validators.required],
      star: [''],
      reviews: [''],
      acceptMethods: ['', Validators.required],
      cancellation: ['', Validators.required],
      highlights: ['', Validators.required],
      includes: ['', Validators.required],
      note: ['', Validators.required],
      languages: ['', Validators.required],
      itinerary: ['', Validators.required],
      imgUrl: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      price: ['', Validators.required],
      priceForChild: ['', Validators.required],
      currency: ['', Validators.required]
    });
  }

  private initFormWithData() {
    this.insertForm.patchValue({
      id: this.extrasPackage.id,
      name: this.extrasPackage.name,
      city: this.extrasPackage.destination,
      // destination: this.tourDetail.destination,
      title: this.extrasPackage.title,
      description: this.extrasPackage.description,
      shortDescription: this.extrasPackage.shortDescription,
      duration: this.extrasPackage.duration,
      star: this.extrasPackage.star,
      reviews: this.extrasPackage.reviews,
      acceptMethods: this.extrasPackage.acceptMethods,
      cancellation: this.extrasPackage.cancellation,
      highlights: this.extrasPackage.highlights,
      includes: this.extrasPackage.includes,
      note: this.extrasPackage.note,
      languages: this.extrasPackage.languages,
      itinerary: this.extrasPackage.itinerary,
      imgUrl: this.extrasPackage.imgUrl,
      latitude: this.extrasPackage.latitude,
      longitude: this.extrasPackage.longitude,
      price: this.extrasPackage.price,
      priceForChild: this.extrasPackage.priceForChild,
      currency: this.extrasPackage.currency,
    });
  }
  searchDestination() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.dashboardService.getDestination(this.search).pipe(
            map((data: DestinationRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => {
              this.searching = false;
            }, err => {
              // in case of http error
              this.limit = 0;
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }
  // tslint:disable-next-line: member-ordering
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  

  insertTour() {
    if (this.insertForm.valid) {
      const d: any = this.insertForm.value;
      d.cityCode = this.cityCode || this.extrasPackage.cityCode;
      d.cityName = this.destinationName || this.extrasPackage.destination;
      d.destination = this.destinationName;
      if(this.insertMode){
        d.highlights = [...(d.highlights as string).split(',')];
        d.includes = [...(d.includes as string).split(',')];
        d.note = [...(d.note as string).split(',')];
        this.tourInsertService.addExtraPackage(d).subscribe(
          (t: ExtrasPackage) => {
            if (t) {
              this.alertify.success('Insert extrasPackage success!');
              this.router.navigate(['/tour/admin/list-item']);
            }
          }, e => {
            this.alertify.error('Insert extrasPackage fail!');
            console.log(e);
          }
        );
      } else {
        this.tourInsertService.updateExtraPackage(d, this.tourId).subscribe(
          (t: ExtrasPackage) => {
            this.alertify.success('Update extrasPackage success!');
            this.router.navigate(['/tour/admin/list-item']);
          }, e => {
            this.alertify.error('Update extrasPackage fail!');
            console.log(e);
          }
        );
      }
    } else {
      return;
    }
  }

  extraPackageAvailabilityList(extraPackageId: string){
    this.router.navigate(['../../extraPackageAvailability', extraPackageId], {relativeTo: this.activeRoute});
  }
}
