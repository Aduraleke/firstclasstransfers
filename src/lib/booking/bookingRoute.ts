export type BookingRoute = {
  routeId: string
  code: string;
  slug: string;
  fromLocation: string;
  toLocation: string;
  vehicleOptions: {
    vehicleType: string;
    fixedPrice: string;
    maxPassengers: number;
    idealFor?: string;
  }[];
};
