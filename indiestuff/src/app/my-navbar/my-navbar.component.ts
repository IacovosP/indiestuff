import { Component, OnInit } from "@angular/core";
import { CreatePlaylistFormComponent } from "../playlist/create-playlist.component";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import httpClient from "../network/HttpClient";
import { PlaylistInterface } from "@apistuff";
import auth from "../auth/Auth";
import { AuthStateEventEmitter } from "../login/loggedInEventEmitter";

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

  constructor(public dialog: MatDialog, authEventEmitter: AuthStateEventEmitter) {
    this.authEventEmitter = authEventEmitter;
  }

  ngOnInit() {
    this.subscription = this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
    if (auth.getAccessToken()) {
      this.getPlaylists();
    }
  }

  getPlaylists() {
    httpClient
      .fetch("playlist")
        .then((response: PlaylistInterface[]) => {
          console.log("playlists: " + JSON.stringify(response));
         this.playlists = response;
      })
      .catch((err) => {
        console.error("error in getting artist: " + err);
      });
  }

  openPlaylistCreationDialog() {
    const dialogRef = this.dialog.open(CreatePlaylistFormComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe(async (result) => {
      const playlist = await result;
      this.playlists.push(playlist);
    });
  }

  changeAuthState(item: any) {
    if (item && item.isRegistered) {
      this.isRegistered = true;
      this.getPlaylists();
    }
  }
}
