import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { myArtistSubPageType } from "@src/app/music-types/types";

@Component({
  selector: "app-artist-menu-bar",
  templateUrl: "./artist-menu-bar.component.html",
  styleUrls: ["./artist-menu-bar.component.css"],
})
export class ArtistMenuBar implements OnInit {
  @Input() isMyArtistPage: boolean = false;
  @Output() myArtistSubPageType: EventEmitter<
    myArtistSubPageType
  > = new EventEmitter();
  @Input() artistId: string;

  ngOnInit() {}

  changeToNewStuffPageType() {
    this.myArtistSubPageType.emit(myArtistSubPageType.NEW_STUFF);
  }

  changeToMyMusicPageType() {
    this.myArtistSubPageType.emit(myArtistSubPageType.MY_MUSIC);
  }
}
