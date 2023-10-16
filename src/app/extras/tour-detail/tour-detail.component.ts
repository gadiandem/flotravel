import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { BsModalRef, ModalOptions, BsModalService } from "ngx-bootstrap/modal";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";

import { TourShoppingRQ } from "src/app/model/thing-to-do/tour-shopping-req";
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from "ngx-gallery";
import { ExtrasPackage } from "src/app/model/thing-to-do/insert-tour/extras-package";
import { Schedule } from "src/app/model/thing-to-do/insert-tour/shedule";
import { ScheduleExtra } from "src/app/model/thing-to-do/schedule-extra-data";
import * as fromApp from "../../store/app.reducer";
import * as TourActions from "../store/thing-to-do.actions";
import { SearchTourDialogComponent } from "../search-tour-dialog/search-dialog.component";
import { thingToDoConstant } from "../thing-to-do.constant";
import { ExtraDetailAvailabilityView } from "src/app/model/thing-to-do/tour-detail/extra-detail-view";
import { ExtraDetailRes } from "src/app/model/thing-to-do/tour-detail/extra-detail-res";
import { ExtraDetailAvailabilityCheckRQ } from "src/app/model/thing-to-do/availability-check/extra-detail-availability-check-req";
import { ExtraPackageAvailabilityInfo } from "src/app/model/thing-to-do/tour-detail/extra-package-availability-info";
import { ExtraDetailAvailabilityInfo } from "src/app/model/thing-to-do/tour-detail/extra-detail-availability";
import { ExtraDetailInfo } from "src/app/model/thing-to-do/tour-detail/extra-detail-info";
@Component({
  selector: "app-tour-detail",
  templateUrl: "./tour-detail.component.html",
  styleUrls: ["./tour-detail.component.css"],
})
export class TourDetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  checkin_date: Date;
  searchTourForm: TourShoppingRQ;
  selectedTour: ExtrasPackage;
  extraDetailData: ExtraDetailRes;
  schedulesView: ExtraDetailAvailabilityView[];
  mappType = "roadmap";
  latitude: number;
  longitude: number;
  marker: Marker;
  
  tourPrice: number;
  selectedPackageAvailability: string;

  packageAvailability: ExtraPackageAvailabilityInfo[];
  extraDetailAvailability: ExtraDetailAvailabilityInfo[];
  constructor(
    public datepipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private route: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.bsConfig = new ModalOptions();
    this.checkin_date = new Date();
    this.marker = {
      lat: 48.881515,
      lng: 2.221985,
      label: "",
      draggable: true,
    };
    this.store.select("tourList").subscribe((data) => {
      this.searchTourForm = data.searchTourReq || JSON.parse(sessionStorage.getItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST));
      this.selectedTour = data.selectedTour || JSON.parse(sessionStorage.getItem(thingToDoConstant.SELECTED_TOUR));
      if (this.selectedTour) {
        this.fillImage();
      }
      this.extraDetailData = data.schedulerListResult ||  JSON.parse(sessionStorage.getItem(thingToDoConstant.SCHEDULER_LIST));

      if(this.extraDetailData){
        this.selectedPackageAvailability = this.extraDetailData.extraPackageAvailability[0].id
        this.updateExtraDetailAvailability(this.extraDetailData.extraPackageAvailability[0].date);
        // this.schedulesView = []
        // this.extraDetailData.extraDetailList.forEach( s => {
        //   const scheduleItem = new ExtraDetailAvailabilityView(s);
        //   scheduleItem.adultCount = 1;
        //   scheduleItem.childCount = 0;
        //   scheduleItem.totalPrice = (this.selectedTour.price + s.extraPrice)*scheduleItem.adultCount + 
        //   (this.selectedTour.priceForChild + s.extraPrice)*scheduleItem.childCount
        //   this.schedulesView.push(scheduleItem);
        // })
        // this.itemPrice();
      }
    });
  }

  openModalWithComponent() {
    const initialState = {
      searchTourReq: Object.assign({}, this.searchTourForm),
      title: "Modal with component",
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = "modal-lg";
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      SearchTourDialogComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = "Close";

    this.bsModalRef.content.event.subscribe((res) => {
      this.searchTourForm = Object.assign({}, res);
    });
  }

  fillImage() {
    this.imageSlider(this.selectedTour.imgUrl);
    this.latitude = +this.selectedTour.latitude;
    this.longitude = +this.selectedTour.longitude;
    this.marker = {
      lat: this.latitude,
      lng: this.longitude,
      label: this.selectedTour.name,
      draggable: true,
    };
  }

  imageSlider(tourImage: string) {
    this.galleryOptions = [
      {
        width: "100%",
        height: "500px",
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
      },
      // max-width 800
      {
        breakpoint: 500,
        width: "100%",
        height: "auto",
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsMargin: 5,
        thumbnailMargin: 10,
      },
      // max-width 400
      {
        breakpoint: 500,
        preview: false,
      },
    ];
    this.galleryImages = new Array();

    for (let i = 0; i < 10; i++) {
      this.galleryImages.push({
        small: tourImage,
        medium: tourImage,
        big: tourImage,
      });
    }
  }

  updateAdultsCount(adultsCount: any, index: number) {
    this.schedulesView[index].adultCount = +adultsCount

    this.itemPriceItem(index);
  }
  updateChildrenCount(childrenCount: any, index: number) {
    this.schedulesView[index].childCount = +childrenCount
    this.itemPriceItem(index);
  }

  itemPrice(){
    this.schedulesView.map( s => {
      s.totalPrice = s.adultCount * (this.selectedTour.price + s.extraPrice) + 
                      (s.childCount * (this.selectedTour.price + s.extraPrice)) / 2
    })
  }

  itemPriceItem(index: number) {
    this.schedulesView[index].totalPrice =
    this.schedulesView[index].adultCount * (this.selectedTour.price + this.schedulesView[index].extraPrice) +
      (this.schedulesView[index].childCount * (this.selectedTour.price + this.schedulesView[index].extraPrice)) / 2;
  }

  changePackageAvailability(packageAvailability: ExtraPackageAvailabilityInfo){
    this.selectedPackageAvailability = packageAvailability.id;
    console.log(packageAvailability.date);
    this.updateExtraDetailAvailability(packageAvailability.date);
  }

  updateExtraDetailAvailability(dateBooking: string){
    if(!this.selectedPackageAvailability && this.extraDetailData){
      this.selectedPackageAvailability = this.extraDetailData.extraPackageAvailability[0].id;
    }
      this.schedulesView = []
      // this.extraDetailData.extraDetailList.forEach( s => {
      //   const scheduleItem = new ExtraDetailAvailabilityView(s);
      //   scheduleItem.adultCount = 1;
      //   scheduleItem.childCount = 0;
      //   scheduleItem.totalPrice = (this.selectedTour.price + s.extraPrice)*scheduleItem.adultCount + 
      //   (this.selectedTour.priceForChild + s.extraPrice)*scheduleItem.childCount
      //   this.schedulesView.push(scheduleItem);
      // })
      const viewTab: ExtraDetailAvailabilityInfo[] = this.extraDetailData.extraDetailAvailabilityList.filter(item => item.extraPackageAvailabilityId === this.selectedPackageAvailability);
      viewTab.forEach(item => {
       const extreDetail: ExtraDetailInfo = this.extraDetailData.extraDetailList.find(extraDetail => extraDetail.id === item.extraDetailId);
       const scheduleItem = new ExtraDetailAvailabilityView(extreDetail);
         scheduleItem.adultCount = 1;
         scheduleItem.childCount = 0;
         scheduleItem.extraDetailAvailabilityId = item.id;
         scheduleItem.date = dateBooking;
         scheduleItem.extraPackgeAvailabilityId = this.selectedPackageAvailability;
         scheduleItem.totalPrice = (this.selectedTour.price + extreDetail.extraPrice)*scheduleItem.adultCount + 
         (this.selectedTour.priceForChild + extreDetail.extraPrice)*scheduleItem.childCount
         this.schedulesView.push(scheduleItem);
      })
      this.itemPrice();
  }

  goToCart(item: ExtraDetailAvailabilityView) {
    sessionStorage.setItem(thingToDoConstant.SELECTED_SCHEDULE, JSON.stringify(item));
    const extraAvailabilityCheck = new ExtraDetailAvailabilityCheckRQ();
    extraAvailabilityCheck.extraDetailAvailabilityId = item.extraDetailAvailabilityId;
    extraAvailabilityCheck.adultCount = item.adultCount;
    extraAvailabilityCheck.childCount = item.childCount;
    this.store.dispatch(new TourActions.ChecAvailabilityStart({ data: extraAvailabilityCheck }));
    this.route.navigate(["../../cart"], { relativeTo: this.activeRoute });
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
