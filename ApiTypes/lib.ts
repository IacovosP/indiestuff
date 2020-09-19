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
}

export interface TrackInterface {
    id: string;
    title: string;
    filename: string;
    durationInSec: number;
    positionInAlbum: number;
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
    positionInAlbum?: number;
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
    positionInPlaylist: number;
}

export interface CommentInterface {
    id: string;
    text: string;
    username: string;
    parentId?: string;
}

export interface PlaylistPageInterface extends PlaylistInterface {
    durationInSec?: number;
    albumImages: string[];
    tracks: TrackInterfaceForPlaylist[];
    comments?: CommentInterface[];
}

export interface ArtistPageInterface extends ArtistInterface {
    topTracks: TrackInterface[];
    albums: AlbumInterface[];
    comments?: CommentInterface[];
}

export interface AlbumPageInterface extends AlbumInterface {
    tracks: TrackInterface[];
    artist: ArtistInterface;
    comments?: CommentInterface[];
}