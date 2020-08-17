import { Component, OnInit, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<SignupFormComponent>;

  title = "indiestuff";
  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (this.clickoutHandler) {
      this.clickoutHandler(event);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignupFormComponent);
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    dialogRef.afterOpened().subscribe(() => {
      this.clickoutHandler = this.closeDialogFromClickout;
    });
  }

  closeDialogFromClickout(event: MouseEvent) {
    console.warn(
      "rect: " +
        JSON.stringify(Object.keys(this.dialogRefClassScope.componentInstance))
    );
    const matDialogContainerEl = this.dialogRefClassScope.componentInstance
      .hostElement.nativeElement.parentElement;
    const rect = matDialogContainerEl.getBoundingClientRect();
    if (
      event.clientX <= rect.left ||
      event.clientX >= rect.right ||
      event.clientY <= rect.top ||
      event.clientY >= rect.bottom
    ) {
      delete this.clickoutHandler;
      this.dialogRefClassScope.close();
    }
  }

  ngOnInit() {}
}
