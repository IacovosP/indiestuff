import { Component, OnInit, ElementRef } from "@angular/core";
import { ArtistMusic } from "@src/app/music-types/artistMusic";

@Component({
  selector: "app-artist-music",
  templateUrl: "./artist-music.component.html",
  styleUrls: ["./artist-music.component.css"],
})
export class ArtistMusicComponent implements OnInit {
  constructor() {}

  private artistMusic: ArtistMusic;

  ngOnInit() {
    const mockTrack = {
      name: "some track 1",
      albumName: "SomeAlbum",
      durationInSec: 125,
      artistname: "SomeArtist",
    };

    const mockTrack2 = {
      name: "some longer titled track",
      albumName: "SomeAlbum",
      durationInSec: 256,
      artistname: "SomeArtist",
    };
    this.artistMusic = new ArtistMusic({
      artistName: "THE ARTIST",
      headerImage: "",
      topTracks: [mockTrack, mockTrack2],
    });
  }
}
