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
import { CommentInterface } from "@apistuff";

@Component({
  selector: "app-childbox",
  templateUrl: "./childbox.component.html",
  styleUrls: ["./childbox.component.css"],
})
export class ChildboxComponent implements OnInit {
  childForm: FormGroup;
  replies: Array<object> = [];
  submitted: Boolean = false;
  @Output() replied = new EventEmitter();
  @Input() commentNo: any;
  @Input() isModal = false;
  @Input() parentId: string;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    console.log("Comment no==>", this.commentNo);
  }

  createForm() {
    this.childForm = this.formBuilder.group({
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
    // if (this.childForm.invalid) {
    //   return false;
    // } else {
    //   this.replyComment.push({
    //     currentDate: new Date(),
    //     text: this.childForm.controls["comment"].value,
    //     username: "some other hardcodename",
    //   });
    //   this.userReplycomment.emit(this.replyComment);
    //   this.deletNo.emit(this.commentNo);
    // }

    if (this.childForm.invalid) {
      return false;
    } else {
      const comment: CommentInterface = {
        username: "hardcoded username",
        text: this.childForm.controls["comment"].value,
        parentId: this.parentId
      };
      this.replied.emit(comment);
      httpClient.fetch(
        "comment/add",
        JSON.stringify({newComment: comment, commentThread: {}}),
        "POST"
      ).then(response => {
        console.log("succeeded in adding reply comment");
      }).catch(error => {
        console.error("failed to add comment: " + error);
      });
    }
  }
}
