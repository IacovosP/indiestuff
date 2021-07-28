import { Component, Input, OnChanges, OnInit, Inject } from '@angular/core';
import { ThreadTypes } from '@src/app/music-types/types';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-comments-container-modal',
    templateUrl: './comments-container-modal.component.html',
    styleUrls: ['./comments-container-modal.component.css']
})
export class CommentModalContainerComponent implements OnInit {
    comments: Array<object>;
    count: number;
    shouldShowComments: boolean;
    commentMessage = 'show';
    threadId: string;
    threadType: ThreadTypes = ThreadTypes.Track;
    commentThreadId: string;

    constructor(private dialogRef: MatDialogRef<CommentModalContainerComponent>, @Inject(MAT_DIALOG_DATA) public data: { threadId: string }) {}

    ngOnInit() {
        this.count = 0;
        this.shouldShowComments = false;
        this.loadCommentThread();
    }

    loadCommentThread() {
        defaultHttpClient
            .fetch('comment/track/' + this.data.threadId)
            .then((response) => {
                this.comments = response.comments;
                this.commentThreadId = response.commentThreadId;
            })
            .catch((error) => {
                console.error('error in loading track comment thread: ' + error);
            });
    }

    receiveComment($event) {
        if (!this.comments && Array.isArray($event)) {
            this.comments = $event; // first event is an array of pre-existing comments
            this.count = this.comments.length;
        } else if (this.comments && !Array.isArray($event)) {
            this.comments.push($event);
            this.count = this.comments.length;
        } else if (!this.comments && !Array.isArray($event)) {
            this.comments = [$event];
            this.count = this.comments.length;
        }
    }

    receiveCount($event) {
        this.comments = $event;
        this.count = this.comments.length;
    }

    toggleShowComments() {
        this.commentMessage = this.shouldShowComments ? 'show' : 'hide';
        this.shouldShowComments = !this.shouldShowComments;
    }
}
