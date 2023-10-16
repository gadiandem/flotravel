import { SearchInsurancePackageReq } from './search-insurance-package.req';

export class SearchQouteRequest extends SearchInsurancePackageReq {
    constructor(searchPackage: SearchInsurancePackageReq) {
        super();
        this.residenceCountry = searchPackage.residenceCountry;
        this.countryOfTravel = searchPackage.countryOfTravel;
        this.travellers = searchPackage.travellers;
        this.startDate = searchPackage.startDate;
        this.endDate = searchPackage.endDate;
        this.packageId  = searchPackage.packageId;
        this.sessionId  = searchPackage.sessionId;
        this.currency  = searchPackage.currency;
        this.executionId  = searchPackage.executionId;
        this.currency  = searchPackage.currency;
    }
    currency: string;
    price: number;
}
