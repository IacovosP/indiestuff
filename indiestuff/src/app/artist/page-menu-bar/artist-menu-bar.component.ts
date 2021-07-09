import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyArtistSubPageType } from '@src/app/music-types/types';

@Component({
    selector: 'app-artist-menu-bar',
    templateUrl: './artist-menu-bar.component.html',
    styleUrls: ['./artist-menu-bar.component.css']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ArtistMenuBar implements OnInit {
    @Input() isMyArtistPage = false;
    @Input() artistId: string;
    @Output() MyArtistSubPageType: EventEmitter<MyArtistSubPageType> = new EventEmitter();

    ngOnInit() {}

    changeToNewStuffPageType() {
        this.MyArtistSubPageType.emit(MyArtistSubPageType.NEW_STUFF);
    }

    changeToMyMusicPageType() {
        this.MyArtistSubPageType.emit(MyArtistSubPageType.MY_MUSIC);
    }
}
