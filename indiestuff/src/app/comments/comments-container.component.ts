import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ThreadTypes } from "@src/app/music-types/types";
import { CommentInterface } from "../../../../ApiTypes/lib";

@Component({
  selector: "app-comments-container",
  templateUrl: "./comments-container.component.html",
  styleUrls: ["./comments-container.component.css"],
})
export class CommentContainerComponent implements OnInit {
  comments: CommentInterface[];
  count: number;
  shouldShowComments: boolean;
  commentMessage = "show";
  @Input() threadId: string;
  @Input() threadType: ThreadTypes;
  @Input() commentThreadId: string;

  constructor() {}

  ngOnInit() {
    this.count = 0;
    this.shouldShowComments = false;
  }

  receiveComment($event: CommentInterface | CommentInterface[]) {
    if (!this.comments && Array.isArray($event)) {
      this.comments = $event; // first event is an array of pre-existing comments
      this.count = this.comments.length;
    } else if (this.comments && !Array.isArray($event)) {
      this.comments.push($event);
      this.count = this.comments.length;
    }
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
