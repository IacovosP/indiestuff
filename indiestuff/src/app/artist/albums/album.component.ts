import { Component, OnInit, Input } from "@angular/core";
import { AlbumLite } from "@src/app/music-types/types";

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.css"],
})
export class AlbumComponent implements OnInit {
  @Input() album: AlbumLite;

  constructor() {}

  ngOnInit() {}
}
