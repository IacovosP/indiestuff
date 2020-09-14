import {
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { TrackInterface } from "@apistuff";

// Import the User model

@Component({
  selector: "app-track-upload-form",
  templateUrl: "./track-upload-form.component.html",
  styleUrls: ["./track-upload-form.component.css"],
})
export class TrackUploadFormComponent implements OnInit {
  constructor(
    public hostElement: ElementRef,
    public dialogRef: MatDialogRef<TrackUploadFormComponent>
  ) {}
  private track: TrackInterface;
  fileToUpload: File;

  ngOnInit() {
    // Create a new user object
    this.track = {
      title: "",
      durationInSec: 0,
      filename: "",
      id: "",
      positionInAlbum: 0
    };
  }

  onFormSubmit({ value, valid }: { value: any; valid: boolean }, event: Event) {
    this.track.title = value.name;
    console.log(value);
    console.log("valid: " + valid);
    const formData = new FormData();
    formData.append("name", this.track.title);
    formData.append("durationInSec", String(this.track.durationInSec));
    formData.append("myFile", this.fileToUpload);
    const restAPIUrl = "http://localhost:5000/upload/track";
    const requestInit: RequestInit = {
      body: formData,
      method: "POST",
    };
    const track = this.track;
    const uploadPromise = fetch(restAPIUrl, requestInit)
      .then((response) => {
        return response.json().then((file) => {
          if (file.filename) {
            track.filename = file.filename;
          }
          console.log("got a response " + JSON.stringify(file));
          return track;
        });
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
    this.dialogRef.close(uploadPromise);
  }

  handleFileInput(files: FileList) {
    console.log("files name :" + files.item(0).name);
    console.log("files type :" + files.item(0).type);
    console.log("files type :" + this.getDuration(files.item(0)));
    this.fileToUpload = files.item(0);
  }

  getDuration(file: File) {
    const reader = new FileReader();

    // When the file has been succesfully read
    reader.onload = (event) => {
      // Create an instance of AudioContext
      const audioContext = new window.AudioContext();

      // Asynchronously decode audio file data contained in an ArrayBuffer.
      audioContext.decodeAudioData(
        event.target.result as ArrayBuffer,
        (buffer) => {
          // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
          const duration = buffer.duration;
          this.track.durationInSec = Math.round(duration);
          console.log(
            "The duration of the song is of: " +
              this.track.durationInSec +
              " seconds"
          );
        }
      );
    };

    // In case that the file couldn't be read
    reader.onerror = function (event) {
      console.error("An error ocurred reading the file: ", event);
    };

    // Read file as an ArrayBuffer, important !
    reader.readAsArrayBuffer(file);
  }
}
