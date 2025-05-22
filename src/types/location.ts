
export interface Attraction {
  name: string;
  distance: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  website: string;
}
