import { Component, OnInit, Input } from "@angular/core";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import {
  AlbumDescription,
  PlaylistDescription,
} from "@src/app/music-types/types";
import { ActivatedRoute } from "@angular/router";

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
  @Input() albumImages: string[];
  @Input() playlistDescription: PlaylistDescription;
  @Input() artistImageUrl: string;
  @Input() isArtistImageEnabled = false;
  uploadedImageUrl: string;
  albumDuration: string;
  isEditing: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.isEditing = false;
      } else {
        this.isEditing = true;
      }
    });
    if (this.route.snapshot.params.id) {
      this.isEditing = false;
    } else {
      this.isEditing = true;
    }
    console.log("artistImage " + this.artistImageUrl);
  }

  loadTopImageFile(files: FileList) {
    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        (document.getElementById("top_image_id") as any).src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
  }

  loadArtistImageFile(files: FileList) {
    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        const artistImageElemnt = document.getElementById(
          "artist_image_id"
        ) as any;
        artistImageElemnt.src = fr.result;
        artistImageElemnt.style.height = "100px";
        artistImageElemnt.style.width = "100px";
        artistImageElemnt.style.marginTop = "0px";
      };
      fr.readAsDataURL(files[0]);
    }
  }

  artistImageUpload(event: any) {
    const files = event.target.files;
    this.artistImageUrl = "file.filename";
    this.loadArtistImageFile(files);
    const formData = new FormData();
    formData.append("myFile", files.item(0));
    const restAPIUrl = "upload/artistImage";
    defaultHttpClient
      .fetch(restAPIUrl, formData, "POST")
      .then((response) => {
        return response.json().then((file) => {
          if (file.filename) {
            this.artistImageUrl = file.filename;
          }
          console.log("got a response " + JSON.stringify(file));
        });
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
  }

  topImageUpload(event: any) {
    const files = event.target.files;
    this.uploadedImageUrl = "file.filename";
    this.loadTopImageFile(files);
    const formData = new FormData();
    formData.append("myFile", files.item(0));
    const restAPIUrl = "upload/artistTopImage";
    defaultHttpClient
      .fetch(restAPIUrl, formData, "POST")
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
