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
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { CommentInterface } from "@src/app/music-types/lib";
import { ThreadTypes } from "@src/app/music-types/types";
import auth from "@src/app/auth/Auth";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";

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
  isRegistered = false;
  authEventEmitter: AuthStateEventEmitter;
  hasLoadedForId: string;

  constructor(
    private formBuilder: FormBuilder,
    authEventEmitter: AuthStateEventEmitter
  ) {
    this.authEventEmitter = authEventEmitter;
  }

  ngOnInit() {
    if (this.commentThreadId) {
      this.hasLoadedForId = this.commentThreadId;
      this.getComments().then((comments) => {
        this.usercomment.emit(comments);
      });
    }
    this.createForm();
    console.debug(
      `threadId: ${this.threadId} and commentThreadId: ${this.threadType}`
    );
    this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
    if (auth.getAccessToken()) {
      this.changeAuthState({ isRegistered: true });
    }
  }

  ngOnChanges() {
    if (this.commentThreadId && this.hasLoadedForId !== this.commentThreadId) {
      this.getComments().then((comments) => {
        this.usercomment.emit(comments);
      });
    }
  }

  getComments(): Promise<CommentInterface[]> {
    return defaultHttpClient
      .fetch("comment/" + this.commentThreadId)
      .then((response) => {
        return response;
      })
      .catch((error) => {
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
        username: auth.getUsername(),
        text: this.commentForm.controls["comment"].value,
      };
      const commentThread = {
        artistId:
          this.threadType === ThreadTypes.Artist ? this.threadId : undefined,
        albumId:
          this.threadType === ThreadTypes.Album ? this.threadId : undefined,
        trackId:
          this.threadType === ThreadTypes.Track ? this.threadId : undefined,
        commentThreadId: this.commentThreadId,
      };
      defaultHttpClient
        .fetch(
          "comment/add",
          JSON.stringify({ newComment: comment, commentThread }),
          "POST"
        )
        .then((response) => {
          this.usercomment.emit(comment);
        })
        .catch((error) => {
          console.error("failed to add comment: " + error);
        });
    }
  }

  changeAuthState(item: any) {
    this.isRegistered = item && item.isRegistered ? true : false;
  }
}
