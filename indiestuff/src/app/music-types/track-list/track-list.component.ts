import { Component, OnInit, Input } from "@angular/core";
import { Track } from "../types";
import { SharedService } from "@src/app/common/shared-service";
import playerEventEmitter, { PlayerChangeEvent } from "@src/app/player-ui/playerEmitter";
import { getFormattedDurationFromSeconds } from "@src/app/utils/timeConverter";
import { PlaylistInterface } from "../../../../../ApiTypes/lib";
import playlistState from "@src/app/playlist/playlistState";
import { CreatePlaylistFormComponent } from "@src/app/playlist/create-playlist.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import httpClient from "@src/app/network/HttpClient";
import { CommentModalContainerComponent } from "@src/app/comments/comments-container-modal.component";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.css"],
})
export class TrackListComponent implements OnInit {
  subscription: any;
  indexOfSongPlaying: number | undefined;
  isPaused: boolean = false;
  playlists: PlaylistInterface[];
  dialogRefClassScope: MatDialogRef<CreatePlaylistFormComponent | CommentModalContainerComponent>;

  constructor(public dialog: MatDialog, private playerSharedService: SharedService) {
    this.playerSharedService = playerSharedService;
  }
  @Input() trackListId: string;
  @Input() isAlbumView: boolean = false;
  @Input() isArtistView: boolean = false;
  currentPlayingTrackListId: string;

  private trackList: Track[];
  @Input() set tracks(value: Track[]) {
    this.trackList = value;
    this.trackList = this.trackList.map((track) => {
      return {
        ...track,
        duration: getFormattedDurationFromSeconds(track.durationInSec),
      };
    });
    console.log("here 0 " + this.indexOfSongPlaying);
    this.indexOfSongPlaying = undefined;
  }

  get tracks(): Track[] {
    return this.trackList;
  }

  updatePlaylistInfo() {
    console.log("playlists: " + JSON.stringify(playlistState.getPlaylists()));
    this.playlists = playlistState.getPlaylists();
  }

  ngOnChanges() {
    console.log("here " + this.indexOfSongPlaying);
    console.log("tracklistid: " + this.trackListId);
    this.trackListId = this.trackListId;
  }

  ngOnInit() {
    this.subscription = playerEventEmitter
      .getEmittedValue()
      .subscribe((item: PlayerChangeEvent) => this.changeIndexOfSongPlaying(item));
  }

  changeIndexOfSongPlaying(item: PlayerChangeEvent) {
    this.currentPlayingTrackListId = item.trackListId;
    if (this.indexOfSongPlaying === item.indexOfTrackToPlay) {
      this.isPaused = !this.isPaused;
    } else {
      this.isPaused = false;
      this.indexOfSongPlaying = item.indexOfTrackToPlay;
    }
  }

  playSong(indexOfSongToPlay: number) {
    if (this.isPaused && indexOfSongToPlay === this.indexOfSongPlaying) {
      this.restartTrack();
      return;
    }
    console.error("play " + indexOfSongToPlay);
    console.error("play " + JSON.stringify(this.trackList));
    this.playerSharedService.change({
      tracks: this.trackList,
      indexOfSongToPlay,
      trackListId: this.trackListId
    });
  }

  addToPlaylist(playlist: PlaylistInterface, indexOfSongInTrackList: number) {
    console.log("song to add to playlist: " + JSON.stringify(this.trackList[indexOfSongInTrackList]));
    httpClient.fetch("playlist/add", JSON.stringify({ trackId: this.trackList[indexOfSongInTrackList].id, playlistId: playlist.id }), "POST")
      .then(response => {
        console.log("successfully added song to playlist " + JSON.stringify(response));
      })
      .catch(err => {
        console.error("Failed to add song to playlist " + err);
      });
  }

  openCommentModal() {
    const dialogRef = this.dialog.open(CommentModalContainerComponent, {
      panelClass: "app-signup-form-no-padding",
      position: {
        left: '60%'
      }
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe(result => {
      // do nothing
    });
  }
  openPlaylistCreationDialog() {
    const dialogRef = this.dialog.open(CreatePlaylistFormComponent, {
      panelClass: "app-signup-form-no-padding",
      position: {
        left: '50%'
      }
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe(async (result) => {
      const playlist = await result;
      if (playlist) {
        this.playlists.push(playlist);
      }
    });
  }

  restartTrack() {
    this.playerSharedService.restart();
  }

  pauseTrack() {
    this.playerSharedService.pause();
  }
}
