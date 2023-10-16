export class ExtrasPackage {
  id: string;
  name: string;
  cityCode: string;
  cityName: string;
  destination: string;
  description: string;
  shortDescription: string;
  title: string;
  duration: string;
  star: number;
  reviews: number;
  acceptMethods: string;
  cancellation: Cancellation;
  highlights: string[];
  includes: string[];
  note: string[];
  languages: string;
  itinerary: string;
  imgUrl: string;
  latitude: number;
  longitude: number;
  videoUrl: string;
  price: number;
  priceForChild: number;
  currency: string;
  discount: number;
}

enum Cancellation {
  FREE, FEE, NOT_ALLOW
}
