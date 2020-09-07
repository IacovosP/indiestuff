import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import { ArtistMusic } from "@src/app/music-types/artistMusic";
import httpClient from "../network/HttpClient";
import { Album, Track } from "../music-types/types";

@Component({
  selector: "app-album-page",
  templateUrl: "./album-page.component.html",
  styleUrls: ["./album-page.component.css"],
})
export class AlbumPageComponent implements OnInit {
  album: Album;
  constructor() {}

  ngOnInit() {
    httpClient
      .fetch("album/5")
      .then((response) => {
        console.log("response for album: " + JSON.stringify(response));
        response.tracks = response.tracks.map((track) => {
          return {
            ...track,
            fileName: track.filename,
            albumName: response.title,
            durationInSec: track.durationInSeconds,
          };
        });
        this.album = response;
        this.album.imageUrl =
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          response.album_image_filename;
      })
      .catch((err) => {
        console.error("error in getting album: " + err);
      });
  }
}
