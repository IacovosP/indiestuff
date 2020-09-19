import { Component, OnInit, Input } from "@angular/core";
import player, { LoopState } from "./player";
import { SharedService } from "@src/app/common/shared-service";
import { Track } from "@src/app/music-types/types";

const loopStateToRepeatIconMap = {
  [LoopState.DEFAULT]: "repeat",
  [LoopState.LOOP_PLAYLIST]: "repeat",
  [LoopState.LOOP_TRACK]: "repeat_one"
};

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
  loopState: LoopState = LoopState.DEFAULT;
  repeatIcon = loopStateToRepeatIconMap[this.loopState];
  volumeValue = 50;

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

  updateVolume(event: {value: number}) {
    player.volume(event.value / 100);
  }

  formatTime(secs: number) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = secs - minutes * 60 || 0;

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

  toggleLoop() {
    this.loopState = player.toggleLoop();
    this.repeatIcon = loopStateToRepeatIconMap[this.loopState];
  }

  seekSongToLocation(event: any) {
    const percentageOfTrackProgress: number = Math.floor(
      (event.layerX / (event.target.offsetWidth - 3)) * 100
    );
    console.log("% " + percentageOfTrackProgress);
    player.seek(percentageOfTrackProgress / 100);
  }

  createPlaylistWithTracks(tracks: Track[]) {
    const playlist = tracks.map(
      (track) =>
        ((track as any) = {
          title: track.title,
          artistName: track.artist.name,
          artistId: track.artist.id,
          file: "Cant Keep Checking My Phone",
          filename: track.filename,
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
