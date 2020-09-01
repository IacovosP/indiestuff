import { Component, OnInit, ElementRef, Injectable } from '@angular/core';
import { ArtistPageLayout, AlbumNew } from '@src/app/music-types/artistMusic';
import { Track } from '@src/app/music-types/types';

@Component({
  selector: 'app-artist-creation-page',
  templateUrl: './artist-creation-page.component.html',
  styleUrls: ['./artist-creation-page.component.css'],
})
export class ArtistCreationPageComponent implements OnInit {
  constructor() {}

  private artistPageLayout: ArtistPageLayout;
  private newAlbum: AlbumNew;
  private tracks: Track[];

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
}
