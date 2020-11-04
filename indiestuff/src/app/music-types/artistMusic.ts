import { AlbumLite, Track } from "./types";
import { TrackInterface, AlbumInterface } from "@apistuff";

export class ArtistMusic {
  artistName: string;
  topTracks: Track[];
  albums?: AlbumLite[];
  headerImageUrl?: string;
  suggestedTracks?: Track[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export interface AlbumEdit extends AlbumNew {
  id: string;
}

export class AlbumNew implements AlbumInterface {
  title: string;
  tracks: TrackInterface[];
  colour: string = "#f8e3ff";
  album_image_filename: string;
  releaseDate: Date = new Date();
  durationInSec: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class ArtistPageLayout {
  artistName: string;
  topTracks?: number[];
  albums?: AlbumLite[];
  headerImageUrl?: string;
  suggestedTracks?: number[];
  paypalEmail?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
