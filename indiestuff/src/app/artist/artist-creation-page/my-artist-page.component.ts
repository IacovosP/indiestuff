import {
    Component,
    Input,
    OnInit
  } from "@angular/core";
import { myArtistSubPageType } from "@src/app/music-types/types";
  
@Component({
    selector: "app-my-artist-page",
    templateUrl: "./my-artist-page.component.html",
    styleUrls: ["./my-artist-page.component.css"],
})
export class MyArtistPageComponent implements OnInit {
    activeSubPageType: myArtistSubPageType;

    constructor() {}

    ngOnInit() {}

    changeMyArtistSubPageType(event: myArtistSubPageType) {
        this.activeSubPageType = event;
    }
}
