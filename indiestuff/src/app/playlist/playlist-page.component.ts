import { Component, OnInit } from '@angular/core';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import { PlaylistDescription } from '../music-types/types';
import { ActivatedRoute } from '@angular/router';
import { pSBC, getBrightness } from '@src/app/utils/colourChange';
import { PlaylistPageInterface, TrackInterfaceForPlaylist, LikedPageInterface } from '@src/app/music-types/lib';
import { getMonthName, getFormattedDurationFromSeconds } from '../utils/timeConverter';

@Component({
    selector: 'app-playlist-page',
    templateUrl: './playlist-page.component.html',
    styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit {
    playlist: PlaylistPageInterface;
    darkColour: string;
    lightColour: string;
    textColour = 'black';
    trackList: TrackInterfaceForPlaylist[] = [];
    playlistDescription: PlaylistDescription;
    isLikedPage = false;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((param) => {
            if (param.id === 'likedTracks') {
                this.loadLikedTracks();
            } else {
                this.loadPage(param.id);
            }
        });
        // const playlistId = String(this.route.snapshot.params.id);
        // if (playlistId === "likedTracks") {
        //   this.loadLikedTracks();
        // } else {
        //   this.loadPage(playlistId);
        // }
    }

    loadLikedTracks() {
        defaultHttpClient
            .fetch('likes')
            .then((response: LikedPageInterface) => {
                this.playlist = {
                    ...response,
                    colour: '#505050',
                    name: 'Liked',
                    id: 'likedTracks'
                };
                this.playlist.albumImages = response.albumImages && response.albumImages.map((image) => 'https://indie-image-test.s3.eu-west-2.amazonaws.com/' + image);
                this.setTrackList(this.playlist);
                this.setPlaylistDescription(this.playlist);
                this.darkColour = pSBC(-0.5, this.playlist.colour);
                if (getBrightness(this.darkColour) < 25) {
                    this.textColour = 'white';
                }
            })
            .catch((err) => {
                console.error('error in getting likes Playlist: ' + err);
            });
    }

    loadPage(playlistId: string) {
        defaultHttpClient
            .fetch('playlist/' + playlistId)
            .then((response: PlaylistPageInterface) => {
                this.playlist = response;
                this.playlist.albumImages = response.albumImages.map((image) => 'https://indie-image-test.s3.eu-west-2.amazonaws.com/' + image);
                this.setTrackList(this.playlist);
                this.setPlaylistDescription(this.playlist);
                this.darkColour = pSBC(-0.5, response.colour);
                if (getBrightness(this.darkColour) < 25) {
                    this.textColour = 'white';
                }
            })
            .catch((err) => {
                console.error('error in getting playlist: ' + err);
            });
    }

    private setTrackList(playlist: PlaylistPageInterface) {
        const sortedTracks = playlist.tracks && playlist.tracks.sort((track1, track2) => track1.positionInPlaylist.localeCompare(track2.positionInPlaylist));
        this.trackList =
            sortedTracks &&
            sortedTracks.map((track) => {
                this.playlist.durationInSec = this.playlist.durationInSec ? this.playlist.durationInSec + track.durationInSec : 0 + track.durationInSec;
                return {
                    ...track,
                    albumName: track.album.title,
                    artistName: track.artist.name
                };
            });
    }
    private setPlaylistDescription(playlist: PlaylistPageInterface) {
        const creationDate = new Date(playlist.createdAt);
        const durationInSec = getFormattedDurationFromSeconds(this.playlist.durationInSec);
        this.playlistDescription = {
            name: playlist.name,
            durationInSec,
            creationDate: `${getMonthName(creationDate.getMonth())} ${creationDate.getDay()}`
        };
    }
}
