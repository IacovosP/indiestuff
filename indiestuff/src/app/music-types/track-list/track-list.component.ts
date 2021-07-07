import { Component, OnInit, Input } from "@angular/core";
import { Track, ThreadTypes } from "../types";
import { SharedService } from "@src/app/common/shared-service";
import playerEventEmitter, {
  PlayerChangeEvent,
} from "@src/app/player-ui/playerEmitter";
import { getFormattedDurationFromSeconds } from "@src/app/utils/timeConverter";
import { PlaylistInterface, TrackInterface } from "@src/app/music-types/lib";
import playlistState from "@src/app/playlist/playlistState";
import { CreatePlaylistFormComponent } from "@src/app/playlist/create-playlist.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { CommentModalContainerComponent } from "@src/app/comments/comments-container-modal.component";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import auth from "@src/app/auth/Auth";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { midString } from "@src/app/utils/arrayRepositioning";

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
  dialogRefClassScope: MatDialogRef<
    CreatePlaylistFormComponent | CommentModalContainerComponent
  >;
  likedTrackIds: string[];
  isRegistered = false;
  authEventEmitter: AuthStateEventEmitter;

  constructor(
    public dialog: MatDialog,
    private playerSharedService: SharedService,
    authEventEmitter: AuthStateEventEmitter
  ) {
    this.playerSharedService = playerSharedService;
    this.authEventEmitter = authEventEmitter;
  }

  @Input() trackListId: string;
  @Input() isAlbumView: boolean = false;
  @Input() isArtistView: boolean = false;
  @Input() playerColour: string;

  currentPlayingTrackListId: string;

  private trackList: Track[];
  @Input() set tracks(value: Track[]) {
    this.trackList = value;
    this.trackList =
      this.trackList &&
      this.trackList.map((track) => {
        return {
          ...track,
          duration: getFormattedDurationFromSeconds(track.durationInSec),
        };
      });

    this.indexOfSongPlaying = undefined;
  }

  get tracks(): Track[] {
    return this.trackList;
  }

  updatePlaylistInfo() {
    this.playlists = playlistState.getPlaylists();
  }

  ngOnChanges() {
    this.trackListId = this.trackListId;
    playlistState.getLikedTrackIdsPromise().then(() => {
      this.likedTrackIds = playlistState.getLikedTrackIds();
    });
  }

  ngOnInit() {
    this.subscription = playerEventEmitter
      .getEmittedValue()
      .subscribe((item: PlayerChangeEvent) =>
        this.changeIndexOfSongPlaying(item)
      );
    if (auth.getAccessToken()) {
      this.changeAuthState({ isRegistered: true });
    }
    this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
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
    this.playerSharedService.change({
      tracks: this.trackList,
      indexOfSongToPlay,
      trackListId: this.trackListId,
      isAlbumView: this.isAlbumView,
      isArtistView: this.isArtistView,
      colour: this.playerColour,
    });
  }

  addToPlaylist(playlist: PlaylistInterface, indexOfSongInTrackList: number) {
    console.log(
      "song to add to playlist: " +
        JSON.stringify(this.trackList[indexOfSongInTrackList])
    );
    defaultHttpClient
      .fetch(
        "playlist/add",
        JSON.stringify({
          trackId: this.trackList[indexOfSongInTrackList].id,
          playlistId: playlist.id,
        }),
        "POST"
      )
      .then((response) => {
        console.log(
          "successfully added song to playlist " + JSON.stringify(response)
        );
      })
      .catch((err) => {
        console.error("Failed to add song to playlist " + err);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    let prevItem =
      event.currentIndex !== 0
        ? // if it's not the first item in the list then prevItem is the one before the new position
          this.tracks[event.currentIndex - 1].positionInPlaylist
        : // if it's the first item in the list then prevItem is an empty string
          "";
    // if item was moved downwards, we need to get the positionInPlaylist of the item that was previously there.
    prevItem =
      event.currentIndex > event.previousIndex
        ? this.tracks[event.currentIndex].positionInPlaylist
        : prevItem;
    let nextItem: string;
    // If it's the first item in the list
    if (event.currentIndex === 0) {
      nextItem =
        event.currentIndex !== this.tracks.length - 1
          ? // if it's not the only item in the list then nextItem is the one that was first before (i.e. the one which is getting replaced in terms of position)
            this.tracks[event.currentIndex].positionInPlaylist
          : // if it's the only item then nextItem empty string
            "";
    } else {
      nextItem =
        event.currentIndex !== this.tracks.length - 1
          ? // if it's not the last item in the list then nextItem is the one that was there before (i.e. the one which is getting replaced in terms of position)
            this.tracks[event.currentIndex].positionInPlaylist
          : // if it's the last item then nextItem empty string
            "";
    }
    moveItemInArray(this.tracks, event.previousIndex, event.currentIndex);
    this.indexOfSongPlaying = event.currentIndex;
    this.playerSharedService.changeIndex({
      newIndexOfSongPlaying: event.currentIndex,
      tracksWithNewIndexing: this.tracks,
    });
    const trackToChange = this.tracks[event.currentIndex];
    console.log("prevItem: " + prevItem);
    console.log("nextItem: " + nextItem);
    trackToChange.positionInPlaylist = midString(prevItem, nextItem);
    defaultHttpClient.fetch(
      "playlist/reposition",
      JSON.stringify({
        trackId: trackToChange.id,
        playlistId: this.trackListId,
        newPosition: trackToChange.positionInPlaylist,
      }),
      "POST"
    );
  }

  removeFromThisPlaylist(indexOfSongInTrackList: number) {
    console.log(
      "song to remove from playlist: " +
        JSON.stringify(this.trackList[indexOfSongInTrackList])
    );
    defaultHttpClient
      .fetch(
        "playlist/remove",
        JSON.stringify({
          trackId: this.trackList[indexOfSongInTrackList].id,
          playlistId: this.trackListId,
        }),
        "POST"
      )
      .then((response) => {
        console.log("successfully removed song to playlist ");
      })
      .catch((err) => {
        console.error("Failed to remove song from playlist " + err);
      });
  }

  addOrRemoveTrackLiked(trackId: string) {
    defaultHttpClient
      .fetch("likes/add", JSON.stringify({ trackId: trackId }), "POST")
      .then((response) => {
        console.log("added or removed liked track successfully");
        const currentLiked = playlistState.getLikedTrackIds();
        if (currentLiked && response.removedId) {
          const indexOfTrack = currentLiked.indexOf(response.removedId);
          if (indexOfTrack > -1) {
            currentLiked.splice(indexOfTrack, 1);
            playlistState.setLikedTrackIds(currentLiked);
          }
        } else {
          playlistState.setLikedTrackIds([...currentLiked, trackId]);
          this.likedTrackIds = playlistState.getLikedTrackIds();
        }
      })
      .catch((error) => {
        console.error("Couldn't add track to liked : " + error);
      });
  }

  openCommentModal(trackId: string) {
    const dialogRef = this.dialog.open(CommentModalContainerComponent, {
      panelClass: "app-signup-form-no-padding",
      position: {
        left: "60%",
      },
      data: {
        threadId: trackId,
      },
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      // do nothing
    });
  }
  openPlaylistCreationDialog() {
    const dialogRef = this.dialog.open(CreatePlaylistFormComponent, {
      panelClass: "app-signup-form-no-padding",
      position: {
        left: "50%",
      },
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

  changeAuthState(item: any) {
    this.isRegistered = item && item.isRegistered ? true : false;

    if (this.isRegistered) {
      playlistState.setLikedTrackIdsPromise();
      playlistState.getLikedTrackIdsPromise().then(() => {
        this.likedTrackIds = playlistState.getLikedTrackIds();
      });
    } else {
      this.likedTrackIds = [];
    }
  }
}
