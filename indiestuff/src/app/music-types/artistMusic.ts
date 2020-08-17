import { Album, Track } from "./types";

export class ArtistMusic {
  artistName: string;
  topTracks: Track[];
  albums?: Album[];
  headerImage?: string;
  suggestedTracks?: Track[];

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}
