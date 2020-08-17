import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: "app-comments-container",
  templateUrl: "./comments-container.component.html",
  styleUrls: ["./comments-container.component.css"],
})
export class CommentContainerComponent implements OnInit {
  comments: string;
  count: number;
  shouldShowComments: boolean;
  commentMessage = "show";

  constructor() {}

  ngOnInit() {
    this.count = 0;
    this.shouldShowComments = false;
  }

  receiveComment($event) {
    this.comments = $event;
    this.count = this.comments.length;
    console.log(this.comments.length);
  }

  recieveCount($event) {
    console.error("what is even: " + $event);
    this.comments = $event;
    this.count = this.comments.length;
  }

  toggleShowComments() {
    this.commentMessage = this.shouldShowComments ? "show" : "hide";
    this.shouldShowComments = !this.shouldShowComments;
  }
}
