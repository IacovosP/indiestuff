import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import httpClient from "../network/HttpClient";
import { ActivatedRoute } from "@angular/router";
import { pSBC, getBrightness } from "@src/app/utils/colourChange";
import { RecentlyPlayedPageInterface, AlbumInterface, ArtistInterface } from "@apistuff";

@Component({
  selector: "app-recently-played",
  templateUrl: "./recently-played.component.html",
  styleUrls: ["./recently-played.component.css"],
})
export class RecentlyPlayedComponent implements OnInit {
  recentlyPlayed: Array<AlbumInterface | ArtistInterface>;

  constructor() {}

  ngOnInit() {
      this.loadRecentlyPlayed();
  }

  loadRecentlyPlayed() {
    httpClient
      .fetch("event/recentlyPlayed")
      .then((response: RecentlyPlayedPageInterface) => {
        this.recentlyPlayed = response.recentlyPlayed;
        const imageLink = "https://indie-image-test.s3.eu-west-2.amazonaws.com/";
      })
      .catch((err) => {
        console.error("error in getting recentlyPlayed: " + err);
      });
  }
}
