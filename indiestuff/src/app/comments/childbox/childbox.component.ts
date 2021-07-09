import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import { CommentInterface } from '@src/app/music-types/lib';
import auth from '@src/app/auth/Auth';

@Component({
    selector: 'app-childbox',
    templateUrl: './childbox.component.html',
    styleUrls: ['./childbox.component.css']
})
export class ChildboxComponent implements OnInit {
    @Output() replied = new EventEmitter();
    @Input() commentNo: any;
    @Input() isModal = false;
    @Input() parentId: string;

    childForm: FormGroup;
    replies: Array<object> = [];
    submitted: Boolean = false;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.createForm();
        console.log('Comment no==>', this.commentNo);
    }

    createForm() {
        this.childForm = this.formBuilder.group({
            comment: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.childForm.invalid) {
            return false;
        } else {
            const comment: CommentInterface = {
                username: auth.getUsername(),
                text: this.childForm.controls['comment'].value,
                parentId: this.parentId
            };
            this.replied.emit(comment);
            defaultHttpClient
                .fetch('comment/add', JSON.stringify({ newComment: comment, commentThread: {} }), 'POST')
                .then((response) => {
                    console.log('succeeded in adding reply comment');
                })
                .catch((error) => {
                    console.error('failed to add comment: ' + error);
                });
        }
    }
}
