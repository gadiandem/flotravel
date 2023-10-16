import { MetaData } from '../../dashboard/hotel/metadata';
import { ItemPrice } from './item-price';

export class SummaryPackageReq {
    sessionId: string;
    packageInfo: ItemPrice;
    hotelId: string;
    hotelRooms: ItemPrice[];
    supplements: ItemPrice[];
    tours: ItemPrice[];
    transfers: ItemPrice[];
    startDate: string;
    metadata: MetaData;
}
