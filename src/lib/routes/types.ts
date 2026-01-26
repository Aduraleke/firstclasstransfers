export type RouteVehicleOption = {
  vehicleType: string;
  maxPassengers: number;
  idealFor?: string;
  fixedPrice: string;
  id:number
};

export type RouteFaq = {
  question: string;
  answer: string;
};

export type RouteDetail = {
  bookingRouteId: string;
  slug: string;

  fromLocation: string;
  toLocation: string;

  metaTitle?: string;
  metaDescription?: string;

  heroTitle: string;
  subheadline: string;
  body: string;

  distance: string;
  time: string;

  sedanPrice?: number;
  vanPrice?: number;

  whatMakesBetter?: string[];
  whatsIncluded?: string[];
  destinationHighlights?: string[];
  idealFor?: string[];

  vehicleOptions: RouteVehicleOption[];
  faq?: RouteFaq[];

  image: string;

  bookCtaLabel?: string;
  bookCtaSupport?: string;
};
