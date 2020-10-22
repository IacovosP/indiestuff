import { Component, OnInit } from "@angular/core";
import { CreatePlaylistFormComponent } from "@src/app/playlist/create-playlist.component";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { PlaylistInterface } from "@apistuff";
import auth from "@src/app/auth/Auth";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import playlistState from "@src/app/playlist/playlistState";

@Component({
  selector: "app-my-navbar",
  templateUrl: "./my-navbar.component.html",
  styleUrls: ["./my-navbar.component.css"],
})
export class MyNavComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;
  dialogRefClassScope: MatDialogRef<CreatePlaylistFormComponent>;
  playlists: PlaylistInterface[];
  subscription: any;
  isRegistered: boolean = false;

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

  getPlaylists() {
    defaultHttpClient
      .fetch("playlist/list")
      .then((response: PlaylistInterface[]) => {
        const likePlaylist: PlaylistInterface = {
          colour: "#505050",
          name: "Liked",
          id: "likedTracks",
        };
        this.playlists = [likePlaylist];
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

  changeAuthState(item: any) {
    this.isRegistered = item && item.isRegistered ? true : false;
    if (this.isRegistered) {
      this.getPlaylists();
    }
  }
}
