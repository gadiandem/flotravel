import { Travellers } from '../../flight/flight-list/request/travellers';
import { InsuranceTravel } from './insurance-travel';
import { ProductCriteria } from './product-criteria';
import { Travelers } from './travelers';

export class ProductInfo {
    productCriteria: ProductCriteria;
    travel: InsuranceTravel;
    name: string;
    guarantees: any[];
    productCode: string;
}