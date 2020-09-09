import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import httpClient from "../network/HttpClient";
import { Album } from "../music-types/types";
import {ActivatedRoute} from '@angular/router';
import { promises } from "dns";

@Component({
  selector: "app-album-page",
  templateUrl: "./album-page.component.html",
  styleUrls: ["./album-page.component.css"],
})
export class AlbumPageComponent implements OnInit {
  album: Album;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("route: " + JSON.stringify(this.route));
    this.route.params.subscribe(param => {
      console.log("params : " + JSON.stringify(param));
      this.loadPage(param.id);
    });
    console.log("here 2 " + JSON.stringify(this.route));
    const albumId = String(this.route.snapshot.params.id);
    this.loadPage(albumId);
  }

  loadPage(albumId: string) {
    console.log("here calling");
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
        this.album = {...response, tracks};
        this.album.imageUrl =
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          response.album_image_filename;
      })
      .catch((err) => {
        console.error("error in getting album: " + err);
      });
  }
}
