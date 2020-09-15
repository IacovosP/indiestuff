import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import httpClient from "../network/HttpClient";
import { Album, AlbumDescription, Track } from "../music-types/types";
import { ActivatedRoute } from "@angular/router";
import { pSBC, getBrightness } from "@src/app/utils/colourChange";
import { AlbumPageInterface } from "@apistuff";
import { getMonthName } from "../utils/timeConverter";

@Component({
  selector: "app-album-page",
  templateUrl: "./album-page.component.html",
  styleUrls: ["./album-page.component.css"],
})
export class AlbumPageComponent implements OnInit {
  album: AlbumPageInterface;
  darkColour: string;
  lightColour: string;
  textColour: string = "black";
  trackList: Track[];
  albumDescription: AlbumDescription;
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
      .then((response: AlbumPageInterface) => {
        this.album = response;
        this.album.album_image_filename =
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          response.album_image_filename;
        this.setAlbumDescription(this.album);
        this.setTrackList(this.album);
        this.darkColour = pSBC(-0.5, response.colour);
        if (getBrightness(this.darkColour) < 25) {
          this.textColour = "white";
        }
      })
      .catch((err) => {
        console.error("error in getting album: " + err);
      });
  }

  private setTrackList(album: AlbumPageInterface) {
    this.trackList = album.tracks.map((track) => {
      return {
        ...track,
        albumName: album.title,
        artistName: album.artist.name,
      };
    });
  }
  private setAlbumDescription(album: AlbumPageInterface) {
    const releaseDate = new Date(album.releaseDate);
    this.albumDescription = {
      title: album.title,
      artistName: album.artist.name,
      durationInSec: album.durationInSec,
      releaseDate: `${getMonthName(
        releaseDate.getMonth()
      )} ${releaseDate.getDay()}`,
    };
  }
}
