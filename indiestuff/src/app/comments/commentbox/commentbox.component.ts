import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import httpClient from "@src/app/network/HttpClient";
import { CommentInterface, CommentThreadInterface } from "@apistuff";
import { ThreadTypes } from "@src/app/music-types/types";

@Component({
  selector: "app-commentbox",
  templateUrl: "./commentbox.component.html",
  styleUrls: ["./commentbox.component.css"],
})
export class CommentboxComponent implements OnInit {
  @Input() isModal = false;
  @Input() threadId: string;
  @Input() threadType: ThreadTypes;
  @Input() commentThreadId: string;

  commentForm: FormGroup;
  submitted: Boolean = false;
  @Output() usercomment = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    if (this.commentThreadId) {
      this.getComments().then(comments => {
        this.usercomment.emit(comments);
      });
    }
    this.createForm();
    console.debug(`threadId: ${this.threadId} and commentThreadId: ${this.threadType}`);
  }

  // ngOnChanges  () {
  //   this.usercomment.emit(this.commentInfo);
  // }

  getComments(): Promise<CommentInterface[]> {
    return httpClient.fetch("comment/" + this.commentThreadId)
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error("error in getting comments: " + error);
        Promise.reject(error);
      });
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      comment: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.commentForm.invalid) {
      return false;
    } else {
      const comment: CommentInterface = {
        username: "hardcoded username",
        text: this.commentForm.controls["comment"].value
      };
      const commentThread = {
        artistId: this.threadType === ThreadTypes.Artist ? this.threadId : undefined,
        albumId: this.threadType === ThreadTypes.Album ? this.threadId : undefined,
        trackId: this.threadType === ThreadTypes.Track ? this.threadId : undefined,
        commentThreadId: this.commentThreadId
      };
      httpClient.fetch(
        "comment/add",
        JSON.stringify({newComment: comment, commentThread}),
        "POST"
      ).then(response => {
        console.log("succeeded in adding comment");
        this.usercomment.emit(comment);
      }).catch(error => {
        console.error("failed to add comment: " + error);
      });
    }
  }
}
