import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-page-top-image",
  templateUrl: "./top-image.component.html",
  styleUrls: ["./top-image.component.css"],
})
export class PageTopImageComponent implements OnInit {
  @Input() headerImageUrl: string;
  constructor() {}

  ngOnInit() {}
}
