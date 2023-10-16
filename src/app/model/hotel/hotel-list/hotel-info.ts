import { Coordinate } from '../../dashboard/hotel/coordinate';
import { AwsImgUrl } from './aws-img-url';

export class HotelInfo {
  public code: string;
  public name: string;
  public address: string;
  public image: AwsImgUrl;
  public hotelPictureUrl: string;
  public description: string;
  public coordinate: Coordinate;
  public starRating: number;
  public minPrice: number;
  public currency: string;
  public title: string;
  public cancelPolicy: string;
  public discount: number;
  public hotelFeatures : string;
  public packageId : string;
  provider: string;
  public roomImages: string[];
}
