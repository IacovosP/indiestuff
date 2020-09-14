import { Component, OnInit, Input } from "@angular/core";
import httpClient from "@src/app/network/HttpClient";
import { AlbumDescription } from "@src/app/music-types/types";
import { getFormattedDurationFromSeconds } from "@src/app/utils/timeConverter";

@Component({
  selector: "app-page-top-image",
  templateUrl: "./top-image.component.html",
  styleUrls: ["./top-image.component.css"],
})
export class PageTopImageComponent implements OnInit {
  @Input() headerImageUrl: string;
  @Input() albumImageUrl: string;
  @Input() darkColour = "#c1c5ca";
  @Input() albumDescription: AlbumDescription;
  @Input() textColour: string;
  uploadedImageUrl: string;
  albumDuration: string;
  constructor() {}

  ngOnInit() {
    this.albumDuration = getFormattedDurationFromSeconds(this.albumDescription.durationInSec);
  }

  loadFile(files: FileList) {
    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        (document.getElementById("top_image_id") as any).src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  }

  topImageUpload(event: any) {
    const files = event.target.files;
    this.uploadedImageUrl = "file.filename";
    this.loadFile(files);
    const formData = new FormData();
    formData.append("myFile", files.item(0));
    const restAPIUrl = "upload/artistImage";
    httpClient.fetch(restAPIUrl, formData, "POST")
      .then((response) => {
        return response.json().then((file) => {
          if (file.filename) {
            this.uploadedImageUrl = file.filename;
          }
          console.log("got a response " + JSON.stringify(file));
        });
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
  }
}
