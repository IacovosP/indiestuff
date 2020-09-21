import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: "app-comments-container-modal",
  templateUrl: "./comments-container-modal.component.html",
  styleUrls: ["./comments-container-modal.component.css"],
})
export class CommentModalContainerComponent implements OnInit {
  comments: string;
  count: number;
  shouldShowComments: boolean;
  commentMessage = "show";

  constructor() {}

  ngOnInit() {
    console.log("opened modal");
    this.count = 0;
    this.shouldShowComments = false;
  }

  receiveComment($event) {
    this.comments = $event;
    this.count = this.comments.length;
    console.log(this.comments.length);
  }

  receiveCount($event) {
    console.error("what is even: " + $event);
    this.comments = $event;
    this.count = this.comments.length;
  }

  toggleShowComments() {
    this.commentMessage = this.shouldShowComments ? "show" : "hide";
    this.shouldShowComments = !this.shouldShowComments;
  }
}
