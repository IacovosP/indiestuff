import { Component, OnInit, ViewChild } from "@angular/core";
import { CreatePlaylistFormComponent } from "@src/app/playlist/create-playlist.component";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { PlaylistInterface } from "@src/app/music-types/lib";
import auth from "@src/app/auth/Auth";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import playlistState from "@src/app/playlist/playlistState";
import { MatMenuTrigger } from "@angular/material/menu";
import { ConfirmationDialogComponent } from "@src/app/common/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-my-navbar",
  templateUrl: "./my-navbar.component.html",
  styleUrls: ["./my-navbar.component.css"],
})
export class MyNavComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;
  dialogRefClassScope: MatDialogRef<
    CreatePlaylistFormComponent | ConfirmationDialogComponent
  >;
  playlists: PlaylistInterface[] = [];
  subscription: any;
  isRegistered: boolean = false;

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: "0px", y: "0px" };

  onContextMenu(event: MouseEvent, playlist: PlaylistInterface) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.contextMenu.menuData = { item: playlist };
    this.contextMenu.menu.focusFirstItem("mouse");
    this.contextMenu.openMenu();
  }

  deletePlaylist(playlistIndex: number) {
    this.openPlaylistConfirmationDialog(playlistIndex);
  }

  constructor(
    public dialog: MatDialog,
    authEventEmitter: AuthStateEventEmitter
  ) {
    this.authEventEmitter = authEventEmitter;
  }

  ngOnInit() {
    this.subscription = this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
    if (auth.getAccessToken()) {
      this.changeAuthState({ isRegistered: true });
    }
  }

  addLikedToPlaylists() {
    playlistState.getLikedTrackIdsPromise().then(() => {
      const likePlaylist: PlaylistInterface = {
        colour: "#505050",
        name: "Liked",
        id: "likedTracks",
      };
      this.playlists = [...this.playlists, likePlaylist];
    });
  }

  getPlaylists() {
    this.addLikedToPlaylists();
    defaultHttpClient
      .fetch("playlist/list")
      .then((response: PlaylistInterface[]) => {
        this.playlists = [...this.playlists, ...response];
        // we don't want the Liked playlist to appear in the add to playlist dropdown
        playlistState.setPlaylists(response);
        if (this.isRegistered) {
          // to re-render the playlist part of the navbar
          this.isRegistered = true;
        }
      })
      .catch((err) => {
        console.error("error in getting artist: " + err);
      });
  }

  openPlaylistCreationDialog() {
    const dialogRef = this.dialog.open(CreatePlaylistFormComponent, {
      panelClass: "app-signup-form-no-padding",
      position: {
        top: "0",
        left: "30%",
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

  openPlaylistConfirmationDialog(itemIndex: number) {
    const playlistToRemove = this.playlists[itemIndex];
    const styleChangesAndInput = playlistToRemove
      ? {
          position: {
            top: "10%",
          },
          data: {
            message: `are you sure you want to remove playlist '${playlistToRemove.name}'?`,
            // clientX: $event.clientX,
            // clientY: $event.clientY,
            // item: playlistToRemove
          },
        }
      : {};
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: "app-signup-form-no-padding",
      ...styleChangesAndInput,
    });
    this.dialogRefClassScope = dialogRef;
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.playlists.splice(itemIndex, 1);
        defaultHttpClient
          .fetch("playlist/" + playlistToRemove.id, undefined, "DELETE")
          .then(() => {
            console.log("succesfully delete album: " + playlistToRemove.id);
          })
          .catch((e) => {
            console.error("Failed to remove album: " + playlistToRemove.id);
          });
      }
    });
  }

  changeAuthState(item: any) {
    this.isRegistered = item && item.isRegistered ? true : false;
    if (this.isRegistered) {
      this.getPlaylists();
    }
  }
}
