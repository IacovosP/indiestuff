import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import httpClient from "../network/HttpClient";
import { Album } from "../music-types/types";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-album-page",
  templateUrl: "./album-page.component.html",
  styleUrls: ["./album-page.component.css"],
})
export class AlbumPageComponent implements OnInit {
  album: Album;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.loadPage(param.id);
    });
    const albumId = String(this.route.snapshot.params.id);
    this.loadPage(albumId);
  }

  loadPage(albumId: string) {
    httpClient
      .fetch("album/" + albumId)
      .then((response) => {
        console.log("response for album: " + JSON.stringify(response));
        const tracks = response.tracks.map((track) => {
          return {
            ...track,
            fileName: track.filename,
            albumName: response.title,
            durationInSec: track.durationInSeconds,
          };
        });
        this.album = { ...response, tracks };
        this.album.imageUrl =
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          response.album_image_filename;
      })
      .catch((err) => {
        console.error("error in getting album: " + err);
      });
  }
}
