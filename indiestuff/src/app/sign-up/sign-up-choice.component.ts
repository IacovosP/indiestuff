import { Component, OnInit, ElementRef, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";
import { ArtistSignupFormComponent } from "@src/app/signup-form/artist-sign-up-form.component";

@Component({
  selector: "app-sign-up-choice",
  templateUrl: "./sign-up-choice.component.html",
  styleUrls: ["./sign-up-choice.component.css"],
})
export class SignupChoiceComponent implements OnInit {
  constructor(public hostElement: ElementRef, public dialog: MatDialog) {}
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<SignupFormComponent>;
  artistDialogRefClassScope: MatDialogRef<ArtistSignupFormComponent>;

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (this.clickoutHandler) {
      this.clickoutHandler(event);
    }
  }

  openFanSignup() {
    const dialogRef = this.dialog.open(SignupFormComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    dialogRef.afterOpened().subscribe(() => {
      this.clickoutHandler = this.closeDialogFromClickout;
    });
  }

  openArtistSignup() {
    const dialogRef = this.dialog.open(ArtistSignupFormComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.artistDialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    dialogRef.afterOpened().subscribe(() => {
      this.clickoutHandler = this.closeDialogFromClickout;
    });
  }

  closeDialogFromClickout(event: MouseEvent) {
    // const matDialogContainerEl = this.dialogRefClassScope.componentInstance
    //   .hostElement; //.nativeElement.parentElement;
    // // const rect = matDialogContainerEl.getBoundingClientRect();
    // console.warn(
    //   "rect: " +
    //     JSON.stringify(rect)
    // );
    // if (
    //   event.clientX <= rect.left ||
    //   event.clientX >= rect.right ||
    //   event.clientY <= rect.top ||
    //   event.clientY >= rect.bottom
    // ) {
    //   delete this.clickoutHandler;
    //   this.dialogRefClassScope.close();
    // }
  }

  ngOnInit() {}
}
