import { Component, OnInit, Input } from "@angular/core";
import { Track } from "../types";
import { SharedService } from '@src/app/common/shared-service';
import playerEventEmitter from "@src/app/player-ui/playerEmitter";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.css"],
})
export class TrackListComponent implements OnInit {
  subscription: any;
  indexOfSongPlaying: number;
  isPaused: boolean = false;

  constructor(private playerSharedService: SharedService) {
    this.playerSharedService = playerSharedService;
  }

  @Input() isAlbumView: boolean = false;
  @Input() tracks: Track[];

  ngOnInit() {
    this.subscription = playerEventEmitter.getEmittedValue()
      .subscribe(item => this.changeIndexOfSongPlaying(item));
  }

  changeIndexOfSongPlaying(indexOfSongPlaying) {
    if (this.indexOfSongPlaying === indexOfSongPlaying) {
      this.isPaused = !this.isPaused;
    } else {
      this.isPaused = false;
      this.indexOfSongPlaying = indexOfSongPlaying;
    }
  }

  playSong(indexOfSongToPlay: number) {
    if (this.isPaused && indexOfSongToPlay === this.indexOfSongPlaying) {
      this.restartTrack();
      return;
    }
    console.error("play " + indexOfSongToPlay);
    console.error("play " + JSON.stringify(this.tracks));
    this.playerSharedService.change({tracks: this.tracks, indexOfSongToPlay});
  }

  restartTrack() {
    this.playerSharedService.restart();
  }

  pauseTrack() {
    this.playerSharedService.pause();
  }
}
