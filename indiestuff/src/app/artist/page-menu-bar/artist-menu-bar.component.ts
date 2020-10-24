import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlbumInterface, ArtistPageInterface } from "@apistuff";
import { AlbumLite, myArtistSubPageType } from "@src/app/music-types/types";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { getFormattedDurationFromSeconds } from "@src/app/utils/timeConverter";

@Component({
  selector: "app-artist-menu-bar",
  templateUrl: "./artist-menu-bar.component.html",
  styleUrls: ["./artist-menu-bar.component.css"],
})
export class ArtistMenuBar implements OnInit {
  @Input() artistId: string;
  @Input() isMyArtistPage: boolean = false;
  @Output() myArtistSubPageType: EventEmitter<myArtistSubPageType> = new EventEmitter();

  private artistMusic: ArtistPageInterface;
  private albumsLite: AlbumLite[];

  ngOnInit() {
      this.loadPage();

  }

  loadPage() {
    defaultHttpClient
      .fetch("artist/single/myArtistPage")
      .then((response: ArtistPageInterface) => {
        this.artistMusic = response;
        this.artistMusic.artist_top_image_filename =
          "https://indie-artist-top-image-test.s3.eu-west-2.amazonaws.com/" +
          response.artist_top_image_filename;
        this.artistMusic.artist_image_filename =
          "https://indie-artist-image-test.s3.eu-west-2.amazonaws.com/" +
          response.artist_image_filename;
        this.setAlbumLite(response.albums);
      })
      .catch((err) => {
        console.error("error in getting artist: " + err);
      });
  }

  setAlbumLite(albums: AlbumInterface[]) {
    this.albumsLite = albums.map((album) => {
      return {
        artistName: this.artistMusic.name,
        duration: getFormattedDurationFromSeconds(album.durationInSec),
        title: album.title,
        id: album.id,
        imageUrl:
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          album.album_image_filename,
      };
    });
  }

  changeToNewStuffPageType() {
    this.myArtistSubPageType.emit(myArtistSubPageType.NEW_STUFF);
  }

  changeToMyMusicPageType() {
    this.myArtistSubPageType.emit(myArtistSubPageType.MY_MUSIC);
  }
}
