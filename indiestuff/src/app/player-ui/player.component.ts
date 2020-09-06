import { Component, OnInit, Input } from "@angular/core";
import { Howl, Howler } from "howler";
import player from "./player";
import { SharedService } from "@src/app/common/shared-service";
import { ArtistMusicComponent } from "@src/app/artist/artist-music/artist-music.component";
import { Playlist, Track } from "@src/app/music-types/types";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"],
})
export class PlayerComponent implements OnInit {
  currentPlaylist: any;
  subscription: any;
  pauseSubscription: any;
  restartSubscription: any;
  playerSharedService: SharedService;
  durationAnimation: any;
  playerElapsedTime;
  isPlaying: boolean = false;
  currentTrack = {};
  currentTime: any;

  constructor(playerSharedService: SharedService) {
    this.playerSharedService = playerSharedService;
    this.startPlayerListener();
  }

  changePlaylist(tracks: Track[], indexOfSongToPlay: number) {
    this.currentPlaylist = this.createPlaylistWithTracks(tracks);
    try {
      player.setPlaylist(this.currentPlaylist);
      player.play(indexOfSongToPlay);
    } catch (e) {
      console.error("errored out ", e);
    }
  }

  startPlayerListener() {
    setInterval(() => {
      this.playerElapsedTime = player.elapsedTimeInPercentage.toFixed(5);
      this.formatTime(Math.round(player.elapsedTimeInSeconds));
      this.isPlaying = player.isPlayerPlaying();
      this.currentTrack = player.getCurrentTrack();
    }, 20);
  }

  formatTime(secs: number) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    this.currentTime = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  pause() {
    player.pause();
  }

  play() {
    player.restart();
  }

  skip() {
    player.skip("next");
  }

  previous() {
    player.skip("prev");
  }

  seekSongToLocation(event: any) {
    let percentageOfTrackProgress: number = Math.floor(
      (event.layerX / (event.target.offsetWidth - 3)) * 100
    );
    console.log("% " + percentageOfTrackProgress);
    player.seek(percentageOfTrackProgress / 100);
  }

  createPlaylistWithTracks(tracks: Track[]) {
    const playlist = tracks.map(
      (track) =>
        ((track as any) = {
          title: track.name,
          artistName: track.artistName,
          file: "Cant Keep Checking My Phone",
          fileName: track.fileName,
          howl: null,
          // html5: true, // A live stream can only be played through HTML5 Audio.
          //   format: ['mp3', 'aac']
        })
    );
    return playlist;
  }

  ngOnInit() {
    this.subscription = this.playerSharedService
      .getEmittedValue()
      .subscribe((item) =>
        this.changePlaylist(item.tracks, item.indexOfSongToPlay)
      );
    this.pauseSubscription = this.playerSharedService
      .getEmittedPause()
      .subscribe((item) => this.pause());
    this.restartSubscription = this.playerSharedService
      .getEmittedRestart()
      .subscribe((item) => this.play());
  }

  ngOnChange() {}
}
