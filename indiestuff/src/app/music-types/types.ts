import { TrackInterface } from '@src/app/music-types/lib';

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
    id: string;
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

// eslint-disable-next-line no-shadow
export enum ThreadTypes {
    'Artist',
    'Album',
    'Track'
}

// eslint-disable-next-line no-shadow
export enum MyArtistSubPageType {
    NEW_STUFF = 'newStuff',
    MY_MUSIC = 'myMusic',
    EDIT_STUFF = 'editStuff'
}

export interface EditSubPageNavigation {
    subPageType: MyArtistSubPageType;
    albumId: string;
}
