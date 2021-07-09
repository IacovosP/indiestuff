import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditSubPageNavigation, MyAlbumsLite, MyArtistSubPageType } from '@src/app/music-types/types';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';

@Component({
    selector: 'app-my-artist-music-page',
    templateUrl: './my-artist-music-page.component.html',
    styleUrls: ['./my-artist-music-page.component.css']
})
export class MyArtistMusicPageComponent implements OnInit {
    @Input() albums: MyAlbumsLite[];
    @Output() MyArtistSubPageType: EventEmitter<EditSubPageNavigation> = new EventEmitter();
    showDeleteOptions: boolean[];

    constructor() {}

    ngOnInit() {
        this.albums = this.albums && this.albums.sort((album1, album2) => (new Date(album1.releaseDate) as any) - (new Date(album2.releaseDate) as any)).reverse();
    }

    toggleDelete(index: number) {
        (this.albums[index] as any).shouldShowDeleteOptions = (this.albums[index] as any).shouldShowDeleteOptions ? !(this.albums[index] as any).shouldShowDeleteOptions : true;
    }

    deleteAlbum(albumId: string, index: number) {
        this.albums.splice(index, 1);

        defaultHttpClient
            .fetch('album/' + albumId, undefined, 'DELETE')
            .then(() => {
                console.log('succesfully delete album: ' + albumId);
            })
            .catch((e) => {
                console.error('Failed to remove album: ' + albumId);
            });
    }

    changeToEditStuffPageType(albumId: string) {
        this.MyArtistSubPageType.emit({
            subPageType: MyArtistSubPageType.EDIT_STUFF,
            albumId
        });
    }
}
