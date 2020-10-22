import { Component, OnInit, ElementRef, Injectable } from "@angular/core";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import {
  AlbumDescription,
  Track,
  ThreadTypes,
} from "@src/app/music-types/types";
import { ActivatedRoute } from "@angular/router";
import { pSBC, getBrightness } from "@src/app/utils/colourChange";
import { AlbumPageInterface } from "@apistuff";
import {
  getMonthName,
  getFormattedDurationFromSeconds,
} from "@src/app/utils/timeConverter";

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
  threadType = ThreadTypes.Album;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.loadPage(param.id);
    });
    // const albumId = String(this.route.snapshot.params.id);
    // this.loadPage(albumId);
  }

  loadPage(albumId: string) {
    defaultHttpClient
      .fetch("album/" + albumId)
      .then((response: AlbumPageInterface) => {
        this.album = response;
        this.album.album_image_filename =
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          response.album_image_filename;
        this.album.artist.artist_image_filename =
          "https://indie-artist-image-test.s3.eu-west-2.amazonaws.com/" +
          response.artist.artist_image_filename;
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
    const sortedTracks = album.tracks.sort((track1, track2) => {
      return track1.positionInAlbum - track2.positionInAlbum;
    });
    this.trackList = sortedTracks.map((track) => {
      return {
        ...track,
        album: {
          id: album.id,
          title: album.title,
        },
        artist: {
          name: album.artist.name,
          id: album.artist.id,
        },
      };
    });
  }
  private setAlbumDescription(album: AlbumPageInterface) {
    const durationInSec = getFormattedDurationFromSeconds(album.durationInSec);
    const releaseDate = new Date(album.releaseDate);
    this.albumDescription = {
      title: album.title,
      artist: {
        name: album.artist.name,
        id: album.artist.id,
      },
      durationInSec,
      releaseDate: `${getMonthName(
        releaseDate.getMonth()
      )} ${releaseDate.toISOString().substr(8, 2)}`,
    };
  }
}
