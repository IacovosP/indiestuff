export interface ArtistInterface {
    id: string;
    name: string;
    artist_top_image_filename: string;
    artist_image_filename: string;
}

export interface AlbumInterface {
    id?: string;
    title: string;
    album_image_filename: string;
    colour: string;
    releaseDate: Date;
    durationInSec: number;
    isSingle: boolean;
}


export enum AlbumOrSingle {
    ALBUM = "album",
    SINGLE = "single"
}

export interface TrackInterface {
    id: string;
    title: string;
    filename: string;
    durationInSec: number;
    positionInAlbum: string;
    commentThreadId?: string;
    positionInPlaylist?: string;
    shouldRemove?: boolean;
}

export interface CommentThreadInterface {
    id: string;
    comments?: CommentInterface[];
    artistId?: string;
    albumId?: string;
    trackId?: string;
}

export interface TrackInterfaceForPlaylist {
    id: string;
    title: string;
    filename: string;
    durationInSec: number;
    album: {
        id: string;
        title: string;
    };
    artist: {
        id: string;
        name: string;
    };
    positionInPlaylist?: string;
}

export interface PlaylistInterface {
    id: string;
    name: string;
    colour: string;
    createdAt?: Date;
}

export interface PlaylistTrackInterface {
    id: string;
    playlist_id: string;
    track_id: string;
    positionInPlaylist: string;
}

export interface CommentInterface {
    id?: string;
    text: string;
    username?: string;
    createdAt?: Date;
    parentId?: string;
}

export interface PlaylistPageInterface extends PlaylistInterface {
    durationInSec?: number;
    albumImages: string[];
    tracks: TrackInterfaceForPlaylist[];
}

export interface LikedPageInterface {
    durationInSec?: number;
    albumImages: string[];
    tracks: TrackInterfaceForPlaylist[];
}

export interface ArtistPageInterface extends ArtistInterface {
    topTracks: TrackInterface[];
    albums: AlbumInterface[];
    commentThreadId: string;
}

export interface AlbumPageInterface extends AlbumInterface {
    tracks: TrackInterface[];
    artist: ArtistInterface;
    commentThreadId: string;
}

export interface RecentlyPlayedPageInterface {
    // tslint:disable-next-line: array-type
    recentlyPlayed: Array<AlbumInterface | ArtistInterface>;
}

export interface HomePageAlbumInterface {
    id: string;
    title: string;
    album_image_filename: string;
    artist: {
        id: string;
        name: string;
    };
}

export interface HomePageInterface {
    albums: HomePageAlbumInterface[]
}

export const POSITION_MULTIPLIER = 10000;