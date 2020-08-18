import { AlbumLite, Track } from "./types";

export class ArtistMusic {
  artistName: string;
  topTracks: Track[];
  albums?: AlbumLite[];
  headerImageUrl?: string;
  suggestedTracks?: Track[];

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}
