import {
  Component,
  OnInit,
  ElementRef,
  Injectable,
  HostListener,
  Input,
} from "@angular/core";
import { ArtistPageLayout, AlbumNew, AlbumEdit } from "@src/app/music-types/artistMusic";
import { Track } from "@src/app/music-types/types";
import { TrackUploadFormComponent } from "./track-upload/track-upload-form.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import playerEventEmitter, {
  PlayerChangeEvent,
} from "@src/app/player-ui/playerEmitter";
import { SharedService } from "@src/app/common/shared-service";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { getBrightness } from "@src/app/utils/colourChange";
import { AlbumPageInterface, TrackInterface } from "@apistuff";
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
  albumForEdit: AlbumPageInterface;
  private tracks: TrackInterface[] = [];

  subscription: any;
  indexOfSongPlaying: number;
  isPaused: boolean = false;
  isAlbumView = false;
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<TrackUploadFormComponent>;
  title = "indiestuff";
  @Input() albumId: string;

  changeIndexOfSongPlaying(item: PlayerChangeEvent) {
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
    console.error("play " + JSON.stringify(this.tracks));
    this.playerSharedService.change({
      tracks: this.tracks,
      indexOfSongToPlay,
      trackListId: "creatingAlbumId",
    });
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
      .subscribe((item: PlayerChangeEvent) =>
        this.changeIndexOfSongPlaying(item)
      );
    this.newAlbum = new AlbumNew({ title: "", tracks: [], durationInSec: 0 });
    this.artistPageLayout = new ArtistPageLayout({
      artistName: "SomeArtist",
      // topTracks?: number[];
      // albums?: AlbumLite[];
      headerImageUrl: "",
      // suggestedTracks?: number[];
      // paypalEmail?: string;});
    });
    if (this.albumId) {
      this.loadAlbumForEdit(this.albumId);
    }
  }

  private setTrackList(album: AlbumPageInterface) {
    const sortedTracks = album.tracks.sort((track1, track2) => {
      return track1.positionInAlbum - track2.positionInAlbum;
    });
    this.tracks = sortedTracks.map((track) => {
      return {
        ...track,
        album: {
          id: album.id,
          title: album.title,
        },
        artist: {
          name: album.artist.name,
          id: album.artist.id,
        },
      };
    });
  }

  loadAlbumForEdit(albumId: string) {
    defaultHttpClient
      .fetch("album/" + albumId)
      .then((response: AlbumPageInterface) => {
        this.albumForEdit = response;
        this.albumForEdit.album_image_filename =
          "https://indie-image-test.s3.eu-west-2.amazonaws.com/" +
          response.album_image_filename;
        this.albumForEdit.artist.artist_image_filename =
          "https://indie-artist-image-test.s3.eu-west-2.amazonaws.com/" +
          response.artist.artist_image_filename;
        this.setTrackList(this.albumForEdit);
      })
      .catch((err) => {
        console.error("error in getting album for edit: " + err);
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
        track.artist = {
          name: "hardcoded artist name",
          id: "hardcoded artist id",
        };
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
    defaultHttpClient
      .fetch(restAPIUrl, formData, "POST")
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
    this.newAlbum.tracks = this.newAlbum.tracks.map((track) => {
      return {
        ...track,
        positionInAlbum: this.newAlbum.tracks.indexOf(track),
      };
    });
    this.newAlbum.colour = !this.newAlbum.colour
      ? "#c2ddde"
      : this.newAlbum.colour;

    console.log("album form submitted: value: " + JSON.stringify(value));
    if (this.albumForEdit) {
      const albumForEditForRequest: AlbumEdit = {
        id: this.albumForEdit.id,
        title: this.albumForEdit.title,
        album_image_filename: this.albumForEdit.album_image_filename.replace("https://indie-image-test.s3.eu-west-2.amazonaws.com/", ""),
        colour: this.newAlbum.colour !== "#c2ddde" ? this.newAlbum.colour : this.albumForEdit.colour,
        durationInSec: this.albumForEdit.durationInSec,
        releaseDate: this.albumForEdit.releaseDate,
        tracks: this.albumForEdit.tracks
      };
      defaultHttpClient
      .fetch(
        "album/edit",
        JSON.stringify({ editedAlbum: albumForEditForRequest }),
        "POST"
      )
      .then((response) => {
        this.router.navigate(["/album", response.albumId]);
      })
      .catch((err) => {
        console.error("error editing album: " + err);
      });
    } else {
      defaultHttpClient
      .fetch(
        "album/create",
        JSON.stringify({ newAlbum: this.newAlbum }),
        "POST"
      )
      .then((response) => {
        this.router.navigate(["/album", response.albumId]);
      })
      .catch((err) => {
        console.error("error creating album: " + err);
      });
    }
  }
}
