import { Component, OnInit, Output } from "@angular/core";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { PlaylistInterface } from "@src/app/music-types/lib";
import { MatDialogRef } from "@angular/material/dialog";
import playlistState from "./playlistState";

@Component({
  selector: "app-create-playlist-form",
  templateUrl: "./create-playlist.component.html",
  styleUrls: ["./create-playlist.component.css"],
})
export class CreatePlaylistFormComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<CreatePlaylistFormComponent>) {}

  @Output() playlist: PlaylistInterface = { name: "", id: "", colour: "" };

  ngOnInit() {}

  updateColor(colour: string) {
    console.log("sth" + colour);
    this.playlist.colour = colour;
  }

  onFormSubmit({ value, valid }: { value: PlaylistInterface; valid: boolean }) {
    this.playlist.name = value.name;
    this.playlist.colour = !this.playlist.colour
      ? "#c2ddde"
      : this.playlist.colour;
    console.log(this.playlist);
    console.log("valid: " + valid);

    const playlistCreationPromise = defaultHttpClient
      .fetch(
        "playlist/create",
        JSON.stringify({ playlist: this.playlist }),
        "POST"
      )
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
    this.dialogRef.close(playlistCreationPromise);
  }
}
