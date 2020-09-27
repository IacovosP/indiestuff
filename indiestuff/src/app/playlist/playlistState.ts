import { PlaylistInterface } from "@apistuff";
import httpClient from "@src/app/network/HttpClient";

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
        console.log("setting liked: " + JSON.stringify(response));
        if (response.length > 0) {
            this.likedTrackIds = response;
        }
    }

    private setLikedTrackIdsPromise() {
        this.likedTrackIdsPromise = httpClient.fetch("likes/ids")
            .then(response => {
              playlistState.setLikedTrackIds(response);
            })
            .catch(error => {
              console.error("couldn't get liked tracks");
            });
    }

    public getLikedTrackIdsPromise() {
        return this.likedTrackIdsPromise;
    }

    public getPlaylists() {
        return this.playlists;
    }

    public getLikedTrackIds() {
        return this.likedTrackIds;
    }
}

const playlistState = new PlaylistState;

export default playlistState;