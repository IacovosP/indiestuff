import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { ArtistPageInterface, AlbumInterface } from "@apistuff";
import { AlbumLite, ThreadTypes } from "@src/app/music-types/types";
import { getFormattedDurationFromSeconds } from "@src/app/utils/timeConverter";

@Component({
  selector: "app-artist-music",
  templateUrl: "./artist-music.component.html",
  styleUrls: ["./artist-music.component.css"],
})
export class ArtistMusicComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  private artistMusic: ArtistPageInterface;
  private albumsLite: AlbumLite[];
  threadType = ThreadTypes.Artist;

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.loadPage(param.id);
    });
    // const artistId = String(this.route.snapshot.params.id);
    // this.loadPage(artistId);
  }

  loadPage(artistId: string) {
    defaultHttpClient
      .fetch("artist/" + artistId)
      .then((response: ArtistPageInterface) => {
        this.artistMusic = response;
        this.artistMusic.artist_top_image_filename = response.artist_top_image_filename && 
          "https://indie-artist-top-image-test.s3.eu-west-2.amazonaws.com/" +
          response.artist_top_image_filename;
        this.artistMusic.artist_image_filename = response.artist_image_filename &&
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
}
