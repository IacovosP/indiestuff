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
import { getBrightness } from "@src/app/utils/colourChange";
import { TrackInterface } from "@apistuff";
import { Router } from "@angular/router";

@Component({
  selector: "app-artist-creation-page",
  templateUrl: "./artist-creation-page.component.html",
  styleUrls: ["./artist-creation-page.component.css"],
})
export class ArtistCreationPageComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private playerSharedService: SharedService,
    private router: Router
  ) {
    this.playerSharedService = playerSharedService;
  }

  private artistPageLayout: ArtistPageLayout;
  newAlbum: AlbumNew;
  private tracks: TrackInterface[] = [];

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
    this.newAlbum = new AlbumNew({ title: "", tracks: [], durationInSec: 0 });
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
      if (track && track.title && track.filename) {
        track.positionInAlbum = 1;
        this.tracks.push(track);
        this.newAlbum.tracks.push(track);
        this.newAlbum.durationInSec += track.durationInSec;
      }
    });
  }

  updateColor(colour: string) {
    console.log("sth" + colour);
    console.log("luma : " + getBrightness(colour));
    this.newAlbum.colour = colour;
  }

  loadFile(files: FileList) {
    // FileReader support
    if (FileReader && files && files.length) {
      const fr = new FileReader();
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
    const restAPIUrl = "upload/image";
    httpClient.fetch(restAPIUrl, formData, "POST")
      .then((response) => {
        if (response.filename) {
          this.newAlbum.album_image_filename = response.filename;
        }
        console.log("got a response " + JSON.stringify(response));
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
  }

  onFormSubmit({ value, valid }: { value: any; valid: boolean }, event: Event) {
    this.newAlbum.title = value.title;
    this.newAlbum.tracks = this.newAlbum.tracks.map(track => {
      return {
        ...track,
        positionInAlbum: this.newAlbum.tracks.indexOf(track)
      };
    });
    console.log("album form submitted: value: " + JSON.stringify(value));
    httpClient.fetch(
      "album/create",
      JSON.stringify({ newAlbum: this.newAlbum }),
      "POST"
    ).then(response => {
      this.router.navigate(["/album", response.albumId]);
    })
    .catch(err => {
      console.error("error creating album: " + err);
    });
  }
}
