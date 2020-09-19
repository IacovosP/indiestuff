import { PlaylistInterface } from "../../../../ApiTypes/lib";

class PlaylistState {
    private playlists: PlaylistInterface[];

    public setPlaylists(playlists: PlaylistInterface[]) {
        this.playlists = playlists;
    }

    public getPlaylists() {
        return this.playlists;
    }
}

const playlistState = new PlaylistState;

export default playlistState;