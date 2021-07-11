import { Component, OnInit } from '@angular/core';
import { AlbumInterface, ArtistInterface, RecentlyPlayedPageInterface } from '@src/app/music-types/lib';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';

@Component({
    selector: 'app-my-most-played',
    templateUrl: './my-most-played.component.html',
    styleUrls: ['./my-most-played.component.css']
})
export class MyMostPlayedComponent implements OnInit {
    mostPlayedArtists: Array<AlbumInterface | ArtistInterface>;
    mostPlayedAlbums: Array<AlbumInterface | ArtistInterface>;

    constructor() {}

    ngOnInit() {
        this.loadMostPlayedArtists();
        this.loadMostPlayedAlbums();
    }

    loadMostPlayedAlbums() {
        defaultHttpClient
            .fetch('event/myMostPlayedAlbums')
            .then((response: RecentlyPlayedPageInterface) => {
                this.mostPlayedAlbums = response.recentlyPlayed;
                const imageLink = 'https://indie-image-test.s3.eu-west-2.amazonaws.com/';
            })
            .catch((err) => {
                console.error('error in getting my mostPlayedAlbums: ' + err);
            });
    }

    loadMostPlayedArtists() {
        defaultHttpClient
            .fetch('event/myMostPlayed')
            .then((response: RecentlyPlayedPageInterface) => {
                this.mostPlayedArtists = response.recentlyPlayed;
                const imageLink = 'https://indie-image-test.s3.eu-west-2.amazonaws.com/';
            })
            .catch((err) => {
                console.error('error in getting my mostPlayed: ' + err);
            });
    }
}
