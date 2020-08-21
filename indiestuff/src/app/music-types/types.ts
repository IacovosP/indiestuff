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
