export interface Cinema {
  _id: string;
  name: string;
  bundleSizes: number[];
}

export interface CreateCinemaData {
  name: string;
  bundleSizes: number[];
}

export interface BookingResult {
  cinema: {
    _id: string;
    name: string;
    bundleSizes: number[];
  };
  groupSize: number;
  possible: boolean;
  bundles: BookingBundle[];
  totalBundles: number;
  totalSeats: number;
}

export interface BookingBundle {
  size: number;
  quantity: number;
}