import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
  } from "@angular/core";
import { EditSubPageNavigation, MyAlbumsLite, myArtistSubPageType } from "@src/app/music-types/types";
@Component({
    selector: "app-my-artist-music-page",
    templateUrl: "./my-artist-music-page.component.html",
    styleUrls: ["./my-artist-music-page.component.css"],
})
export class MyArtistMusicPageComponent implements OnInit {
    @Input() albums: MyAlbumsLite[];
    @Output() myArtistSubPageType: EventEmitter<EditSubPageNavigation> = new EventEmitter();

    constructor() {}

    ngOnInit() {
        this.albums = this.albums.sort((album1, album2) => {
            return new Date(album1.releaseDate) as any - (new Date(album2.releaseDate) as any);
        }).reverse();
    }

    changeToEditStuffPageType(albumId: string) {
        this.myArtistSubPageType.emit({ subPageType: myArtistSubPageType.EDIT_STUFF, albumId });
    }
}
