import { Component, OnInit, Input } from "@angular/core";
import { Track } from "../types";
import { SharedService } from '@src/app/common/shared-service';

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.css"],
})
export class TrackListComponent implements OnInit {
  constructor(private playerSharedService: SharedService) {
    this.playerSharedService = playerSharedService;
  }

  @Input() isAlbumView: boolean = false;
  @Input() tracks: Track[];

  ngOnInit() {}

  playSong() {
    console.error("play 1" );
    console.error("play " + JSON.stringify(this.tracks));
    this.playerSharedService.change(this.tracks);
  }
}
