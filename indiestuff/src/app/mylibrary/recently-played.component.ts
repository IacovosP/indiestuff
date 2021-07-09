import { Component, OnInit, ElementRef, Injectable } from '@angular/core';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import { RecentlyPlayedPageInterface, AlbumInterface, ArtistInterface } from '@src/app/music-types/lib';

@Component({
    selector: 'app-recently-played',
    templateUrl: './recently-played.component.html',
    styleUrls: ['./recently-played.component.css']
})
export class RecentlyPlayedComponent implements OnInit {
    recentlyPlayed: Array<AlbumInterface | ArtistInterface>;

    constructor() {}

    ngOnInit() {
        this.loadRecentlyPlayed();
    }

    loadRecentlyPlayed() {
        defaultHttpClient
            .fetch('event/recentlyPlayed')
            .then((response: RecentlyPlayedPageInterface) => {
                this.recentlyPlayed = response.recentlyPlayed;
                const imageLink = 'https://indie-image-test.s3.eu-west-2.amazonaws.com/';
            })
            .catch((err) => {
                console.error('error in getting recentlyPlayed: ' + err);
            });
    }
}
