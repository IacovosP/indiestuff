import { Component, OnInit, Input } from "@angular/core";
import { Track } from "../types";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.css"],
})
export class TrackListComponent implements OnInit {
  constructor() {}

  @Input() tracks: Track[];

  ngOnInit() {}
}
