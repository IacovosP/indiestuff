import { TrackInterface } from "@apistuff";

export interface Track extends TrackInterface {
  albumName: string;
  artistName: string;
  duration?: string;
}

export interface Album {
  name: string;
  durationInSec: number;
  artistName: string;
  imageUrl: string;
  tracks: Track[];
}

export interface AlbumLite {
  name: string;
  durationInSec: number;
  artistName: string;
  imageUrl: string;
}

export interface Playlist {
  tracks: Track[];
  firstTrackIndex: number;
}

export interface AlbumDescription {
  title: string;
  durationInSec: number;
  artistName: string;
  releaseDate: string;
}
