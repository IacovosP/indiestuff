import {
  Component,
  OnInit,
  ElementRef,
  Injectable,
  HostListener,
} from "@angular/core";
import { ArtistPageLayout, AlbumNew } from "@src/app/music-types/artistMusic";
import { Track } from "@src/app/music-types/types";
import { TrackUploadFormComponent } from "./track-upload/track-upload-form.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import playerEventEmitter from "@src/app/player-ui/playerEmitter";
import { SharedService } from "@src/app/common/shared-service";
import httpClient from "@src/app/network/HttpClient";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: "app-artist-creation-page",
  templateUrl: "./artist-creation-page.component.html",
  styleUrls: ["./artist-creation-page.component.css"],
})
export class ArtistCreationPageComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private playerSharedService: SharedService
  ) {
    this.playerSharedService = playerSharedService;
  }

  private artistPageLayout: ArtistPageLayout;
  newAlbum: AlbumNew;
  private tracks: Track[] = [];

  subscription: any;
  indexOfSongPlaying: number;
  isPaused: boolean = false;
  isAlbumView = false;
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<TrackUploadFormComponent>;

  title = "indiestuff";

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
    this.playerSharedService.change({ tracks: this.tracks, indexOfSongToPlay });
  }

  restartTrack() {
    this.playerSharedService.restart();
  }

  pauseTrack() {
    this.playerSharedService.pause();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tracks, event.previousIndex, event.currentIndex);
  }

  ngOnInit() {
    this.subscription = playerEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeIndexOfSongPlaying(item));
    this.newAlbum = new AlbumNew({ title: "", tracks: [] });
    this.artistPageLayout = new ArtistPageLayout({
      artistName: "SomeArtist",
      // topTracks?: number[];
      // albums?: AlbumLite[];
      headerImageUrl: "",
      // suggestedTracks?: number[];
      // paypalEmail?: string;});
    });
  }
  openTrackUploadForm() {
    const dialogRef = this.dialog.open(TrackUploadFormComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.dialogRefClassScope = dialogRef;
    dialogRef.afterClosed().subscribe(async (result) => {
      const track = await result;
      console.log(`Dialog result: ${track}`);
      if (track && track.name && track.fileName) {
        this.tracks.push(track);
        this.newAlbum.tracks.push(track);
      }
    });
  }

  updateColor(colour: string) {
    this.newAlbum.colour = colour;
  }

  loadFile(files: FileList) {
    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        (document.getElementById("file_id") as any).src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  }

  imageUpload(event: any) {
    const files = event.target.files;
    this.loadFile(files);
    const formData = new FormData();
    formData.append("myFile", files.item(0));
    const restAPIUrl = "http://localhost:5000/upload/image";
    const requestInit: RequestInit = {
      body: formData,
      method: "POST",
    };
    fetch(restAPIUrl, requestInit)
      .then((response) => {
        return response.json().then((file) => {
          if (file.fileName) {
            this.newAlbum.imageFileName = file.fileName;
          }
          console.log("got a response " + JSON.stringify(file));
        });
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
  }

  onFormSubmit({ value, valid }: { value: any; valid: boolean }, event: Event) {
    this.newAlbum.title = value.title;
    console.log("album form submitted: value: " + JSON.stringify(value));
    httpClient.fetch(
      "album/create",
      JSON.stringify({ newAlbum: this.newAlbum }),
      "POST"
    );
  }
}
