import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
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
      headerImageUrl:
        "https://crypticrock.com/wp-content/uploads/2020/02/the-slow-rush-slide.jpg",
      topTracks: [mockTrack, mockTrack2],
      albums: [
        {
          name: "SomeAlbum",
          durationInSec: 12000,
          artistName: "SomeArtist",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png",
        },
        {
          name: "SomeAlbum part 2",
          durationInSec: 11000,
          artistName: "SomeArtist",
          imageUrl:
            "https://centaur-wp.s3.eu-central-1.amazonaws.com/creativereview/prod/content/uploads/2020/02/1-Tame-Impala-TSR-%E2%80%93-Neil-Krug.jpg",
        },
        {
          name: "SomeAlbum",
          durationInSec: 12000,
          artistName: "SomeArtist",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png",
        },
        {
          name: "SomeAlbum part 2",
          durationInSec: 11000,
          artistName: "SomeArtist",
          imageUrl:
            "https://centaur-wp.s3.eu-central-1.amazonaws.com/creativereview/prod/content/uploads/2020/02/1-Tame-Impala-TSR-%E2%80%93-Neil-Krug.jpg",
        },
        {
          name: "SomeAlbum",
          durationInSec: 12000,
          artistName: "SomeArtist",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png",
        },
        {
          name: "SomeAlbum part 2",
          durationInSec: 11000,
          artistName: "SomeArtist",
          imageUrl:
            "https://centaur-wp.s3.eu-central-1.amazonaws.com/creativereview/prod/content/uploads/2020/02/1-Tame-Impala-TSR-%E2%80%93-Neil-Krug.jpg",
        },
        {
          name: "SomeAlbum",
          durationInSec: 12000,
          artistName: "SomeArtist",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png",
        },
        {
          name: "SomeAlbum part 2",
          durationInSec: 11000,
          artistName: "SomeArtist",
          imageUrl:
            "https://centaur-wp.s3.eu-central-1.amazonaws.com/creativereview/prod/content/uploads/2020/02/1-Tame-Impala-TSR-%E2%80%93-Neil-Krug.jpg",
        },
      ],
    });
  }
}
