import { TrackInterface } from "@apistuff";

export interface Track extends TrackInterface {
  album: {
    id: string;
    title: string;
  };
  artist: {
    id: string;
    name: string;
  };
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
  title: string;
  duration: string;
  artistName: string;
  imageUrl: string;
}

export interface MyAlbumsLite extends AlbumLite {
  releaseDate: string;
  isReleased: boolean;
}

export interface Playlist {
  tracks: Track[];
  firstTrackIndex: number;
}

export interface AlbumDescription {
  title: string;
  durationInSec: string;
  artist: {
    name: string;
    id: string;
  };
  releaseDate: string;
}

export interface PlaylistDescription {
  name: string;
  durationInSec: string;
  creationDate: string;
}

export enum ThreadTypes {
  "Artist",
  "Album",
  "Track",
}

export enum myArtistSubPageType {
  NEW_STUFF = "newStuff",
  MY_MUSIC = "myMusic",
  EDIT_STUFF = "editStuff",
}

export interface EditSubPageNavigation {
  subPageType: myArtistSubPageType;
  albumId: string;
}
