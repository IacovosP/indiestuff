import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import { ArtistPageLayout, AlbumNew } from "@src/app/music-types/artistMusic";

@Component({
  selector: "app-artist-creation-page",
  templateUrl: "./artist-creation-page.component.html",
  styleUrls: ["./artist-creation-page.component.css"],
})
export class ArtistCreationPageComponent implements OnInit {
  constructor() {}

  private artistPageLayout: ArtistPageLayout;
  private newAlbum: AlbumNew;
  ngOnInit() {
    this.newAlbum = new AlbumNew({ title: "" });
    this.artistPageLayout = new ArtistPageLayout({
      artistName: "SomeArtist",
      // topTracks?: number[];
      // albums?: AlbumLite[];
      headerImageUrl: "",
      // suggestedTracks?: number[];
      // paypalEmail?: string;});
    });
  }
}
