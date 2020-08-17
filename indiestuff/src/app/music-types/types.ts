export interface Track {
  name: string;
  durationInSec: number;
  albumName: string;
  artistName: string;
}

export interface Album {
  name: string;
  durationInSec: number;
  artistName: string;
  imageUrl: string;
}
