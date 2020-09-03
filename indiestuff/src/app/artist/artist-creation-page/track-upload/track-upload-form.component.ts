import { Component, OnInit, ElementRef } from "@angular/core";
import { Track } from "@src/app/music-types/types";

// Import the User model

@Component({
  selector: "app-track-upload-form",
  templateUrl: "./track-upload-form.component.html",
  styleUrls: ["./track-upload-form.component.css"],
})
export class TrackUploadFormComponent implements OnInit {
  constructor(public hostElement: ElementRef) {}
  // Property for the user
  private track: Track;
  ngOnInit() {
    // Create a new user object
    this.track = {
        name: "",
        durationInSec: 0,
        albumName: "",
        artistName: ""
    }
  }

  onFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    // this.user = value;
    // console.log(this.user);
    // console.log("valid: " + valid);
  }
}
