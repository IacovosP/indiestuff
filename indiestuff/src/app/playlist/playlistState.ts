import { PlaylistInterface } from '@src/app/music-types/lib';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import auth from '../auth/Auth';

export class PlaylistState {
    private playlists: PlaylistInterface[];
    private likedTrackIds: string[];
    private likedTrackIdsPromise: Promise<void>;

    constructor() {
        this.setLikedTrackIdsPromise();
    }
    public setPlaylists(playlists: PlaylistInterface[]) {
        this.playlists = playlists;
    }

    public addToPlaylists(playlist: PlaylistInterface) {
        this.playlists = this.playlists.length > 0 ? [...this.playlists, playlist] : [playlist];
    }

    public setLikedTrackIds(response: any) {
        console.log('setting liked: ' + JSON.stringify(response));
        if (response.length > 0) {
            this.likedTrackIds = response;
        }
    }

    public setLikedTrackIdsPromise() {
        if (!auth.getAccessToken()) {
            return;
        }
        this.likedTrackIdsPromise = defaultHttpClient
            .fetch('likes/ids')
            .then((response) => {
                this.setLikedTrackIds(response);
            })
            .catch((error) => {
                console.error("couldn't get liked tracks");
            });
    }

    public getLikedTrackIdsPromise() {
        return Promise.resolve(this.likedTrackIdsPromise);
    }

    public getPlaylists() {
        return this.playlists;
    }

    public getLikedTrackIds() {
        return this.likedTrackIds;
    }
}

const playlistState = new PlaylistState();

export default playlistState;
