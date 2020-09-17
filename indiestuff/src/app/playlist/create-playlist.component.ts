import { Component, OnInit, ElementRef, Output } from "@angular/core";
import httpClient from "@src/app/network/HttpClient";
import { PlaylistInterface } from "@apistuff";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-create-playlist-form",
  templateUrl: "./create-playlist.component.html",
  styleUrls: ["./create-playlist.component.css"],
})
export class CreatePlaylistFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreatePlaylistFormComponent>) {}

  @Output() playlist: PlaylistInterface = {name: "" , id: "", colour: ""};

  ngOnInit() {}

  updateColor(colour: string) {
    console.log("sth" + colour);
    this.playlist.colour = colour;
  }

  onFormSubmit({ value, valid }: { value: PlaylistInterface; valid: boolean }) {
    this.playlist.name = value.name;
    console.log(this.playlist);
    console.log("valid: " + valid);

    const playlistCreationPromise = httpClient
      .fetch("playlist/create", JSON.stringify({ playlist: this.playlist }), "POST")
      .then((response) => {
        console.log("got a response " + JSON.stringify(response));
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
    this.dialogRef.close(playlistCreationPromise)
  }
}
