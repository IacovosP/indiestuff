import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-artist-menu-bar",
  templateUrl: "./artist-menu-bar.component.html",
  styleUrls: ["./artist-menu-bar.component.css"],
})
export class ArtistMenuBar implements OnInit {
  @Input() artistId: string;

  constructor() {}

  ngOnInit() {}
}
