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

@Component({
  selector: "app-commentbox",
  templateUrl: "./commentbox.component.html",
  styleUrls: ["./commentbox.component.css"],
})
export class CommentboxComponent implements OnInit {
  @Input() isModal = false;
  
  commentForm: FormGroup;
  commentInfo: Array<object> = [
    {
      commentId: 0,
      commentTxt: "some comment already written",
      author: "my hardcodedname",
      favourite: true,
      pinnedFavourite: true,
      replyComment: [],
      currentDate: new Date(),
    },
    {
      commentId: 1,
      author: "my hardcodedname",
      commentTxt: "some other comment already written",
      favourite: false,
      replyComment: [],
      currentDate: new Date(),
    },
  ];
  submitted: Boolean = false;
  public id = 2;
  @Output() usercomment = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.usercomment.emit(this.commentInfo);
    this.createForm();
  }
  // ngOnChanges  () {
  //   this.usercomment.emit(this.commentInfo);
  // }
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
      this.commentInfo.push({
        commentId: this.id++,
        author: "hardcoded username",
        currentDate: new Date(),
        commentTxt: this.commentForm.controls["comment"].value,
        replyComment: [],
      });
      this.usercomment.emit(this.commentInfo);
    }
  }
}
