import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from "@angular/core";
import { CommentInterface } from "@apistuff";

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

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.postComment !== undefined) {
      console.log("Main array====>", this.postComment);
    }
  }

  removeComment(no) {
    this.postComment.splice(no, 1);
    console.log("After remove array====>", this.postComment);
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
}
