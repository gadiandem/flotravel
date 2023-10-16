import { ExtraDetailInfo } from "./extra-detail-info";

export class ExtraDetailAvailabilityView extends ExtraDetailInfo{

    constructor(extraDetail: ExtraDetailInfo) {
        super();
        this.extraPackageId = extraDetail.extraPackageId;
        this.extraPrice = extraDetail.extraPrice;
        this.fromTime = extraDetail.fromTime;
        this.toTime = extraDetail.toTime;
        this.id = extraDetail.id;
        this.description = extraDetail.description;
        this.title = extraDetail.title;
    }
    adultCount: number;
    childCount: number;
    date: string;
    extraDetailAvailabilityId: string;
    extraPackgeAvailabilityId: string;
    totalPrice: number;
}