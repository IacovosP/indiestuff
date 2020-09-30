import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from "@angular/core";
import { CommentInterface } from "@apistuff";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import auth from "@src/app/auth/Auth";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() isModal = false;
  @Input() postComment: Array<object> = [];
  @Output() countComments = new EventEmitter();
  public loadComponent = false;
  public commentIndex = 0;
  public reply: Array<object> = [];
  isRegistered = false;
  authEventEmitter: AuthStateEventEmitter;

  constructor(authEventEmitter: AuthStateEventEmitter) {
    this.authEventEmitter = authEventEmitter;
  }

  ngOnInit() {
    this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
    if (auth.getAccessToken()) {
      this.changeAuthState({isRegistered: true});
    }
  }

  ngOnChanges() {
    if (this.postComment !== undefined) {
      console.debug("Main array====>", this.postComment);
    }
  }

  removeComment(no) {
    this.postComment.splice(no, 1);
    console.debug("After remove array====>", this.postComment);
    this.countComments.emit(this.postComment);
  }

  toggleReplyComment(post: any) {
    post.shouldShowReplyBox = true;
  }

  onReply(replyComment: CommentInterface, post: any) {
    if (post.replies) {
      post.replies.push(replyComment);
    } else {
      post.replies = [replyComment];
    }
    post.shouldShowReplyBox = false;
  }

  changeAuthState(item: any) {
    this.isRegistered = item && item.isRegistered ? true : false;
  }
}
