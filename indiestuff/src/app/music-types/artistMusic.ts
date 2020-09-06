import { AlbumLite, Track } from "./types";

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

export class AlbumNew {
  title: string;
  tracks: Track[];
  colour?: string = "#f8e3ff";

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
