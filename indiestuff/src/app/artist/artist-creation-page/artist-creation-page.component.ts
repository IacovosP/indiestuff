import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import { ArtistPageLayout } from "@src/app/music-types/artistMusic";

@Component({
  selector: "app-artist-creation-page",
  templateUrl: "./artist-creation-page.component.html",
  styleUrls: ["./artist-creation-page.component.css"],
})
export class ArtistCreationPageComponent implements OnInit {
  constructor() {}

  private artistPageLayout: ArtistPageLayout;

  ngOnInit() {
    this.artistPageLayout = new ArtistPageLayout({
      artistName: "SomeArtist",
      // topTracks?: number[];
      // albums?: AlbumLite[];
      headerImageUrl: ""
      // suggestedTracks?: number[];
      // paypalEmail?: string;});
    })
  }
}
