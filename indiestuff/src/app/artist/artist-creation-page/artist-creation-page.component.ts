import { Component, OnInit, ElementRef, Injectable, HostListener } from '@angular/core';
import { ArtistPageLayout, AlbumNew } from '@src/app/music-types/artistMusic';
import { Track } from '@src/app/music-types/types';
import { TrackUploadFormComponent } from './track-upload/track-upload-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-artist-creation-page',
  templateUrl: './artist-creation-page.component.html',
  styleUrls: ['./artist-creation-page.component.css'],
})
export class ArtistCreationPageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  private artistPageLayout: ArtistPageLayout;
  private newAlbum: AlbumNew;
  private tracks: Track[];

  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<TrackUploadFormComponent>;

  title = "indiestuff";

  ngOnInit() {
    this.tracks = [{name: 'track1', durationInSec: 55, albumName: 'someAlbum', artistName: 'SomeArtist'},
     {name: 'track2', durationInSec: 155, albumName: 'someAlbum', artistName: 'SomeArtist'}];
    this.newAlbum = new AlbumNew({ title: '' });
    this.artistPageLayout = new ArtistPageLayout({
      artistName: 'SomeArtist',
      // topTracks?: number[];
      // albums?: AlbumLite[];
      headerImageUrl: '',
      // suggestedTracks?: number[];
      // paypalEmail?: string;});
    });
  }
  openTrackUploadForm() {
    const dialogRef = this.dialog.open(TrackUploadFormComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

