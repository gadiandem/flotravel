import { AwsImgUrl } from '../hotel-list/aws-img-url';

export class NuiteeData {
  sessionId: string;
  roomCode: string;
  propertyCode: string;
  hotelId: number;
  userId: string;
  broadId: string;
  rateDetailCode: string;
  public image: AwsImgUrl;
}
