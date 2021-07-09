import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlbumInterface, ArtistPageInterface } from '@src/app/music-types/lib';
import { EditSubPageNavigation, MyAlbumsLite, MyArtistSubPageType } from '@src/app/music-types/types';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import { getFormattedDurationFromSeconds, getMonthName } from '@src/app/utils/timeConverter';

@Component({
    selector: 'app-my-artist-page',
    templateUrl: './my-artist-page.component.html',
    styleUrls: ['./my-artist-page.component.css']
})
export class MyArtistPageComponent implements OnInit {
    activeSubPageType: MyArtistSubPageType = MyArtistSubPageType.NEW_STUFF;
    artistMusic: ArtistPageInterface;
    albumsLite: MyAlbumsLite[];
    currentAlbumToEdit: string;

    constructor(private router: Router) {}
    ngOnInit() {
        this.loadPage();
    }

    loadPage() {
        defaultHttpClient
            .fetch('artist/single/myArtistPage')
            .then((response: ArtistPageInterface) => {
                this.artistMusic = response;
                this.artistMusic.artist_top_image_filename =
                    response.artist_top_image_filename && 'https://indie-artist-top-image-test.s3.eu-west-2.amazonaws.com/' + response.artist_top_image_filename;
                this.artistMusic.artist_image_filename =
                    response.artist_image_filename && 'https://indie-artist-image-test.s3.eu-west-2.amazonaws.com/' + response.artist_image_filename;
                this.setAlbumLite(response.albums);
            })
            .catch((err) => {
                console.error('error in getting artist: ' + JSON.stringify(err));
                this.router.navigate(['/home']);
            });
    }

    setAlbumLite(albums: AlbumInterface[]) {
        this.albumsLite = albums.map((album) => {
            const releaseDate = new Date(album.releaseDate);
            return {
                artistName: this.artistMusic.name,
                duration: getFormattedDurationFromSeconds(album.durationInSec),
                title: album.title,
                id: album.id,
                releaseDate: `${getMonthName(releaseDate.getMonth())} ${releaseDate.toISOString().substr(8, 2)}`,
                isReleased: releaseDate < new Date(),
                imageUrl: 'https://indie-image-test.s3.eu-west-2.amazonaws.com/' + album.album_image_filename,
                isSingle: album.isSingle
            };
        });
    }

    changeMyArtistSubPageType(event: MyArtistSubPageType) {
        this.activeSubPageType = event;
    }

    changeToEditAlbumPageType(event: EditSubPageNavigation) {
        this.activeSubPageType = event.subPageType;
        this.currentAlbumToEdit = event.albumId;
    }
}
