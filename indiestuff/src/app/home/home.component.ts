import { Component, OnInit, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SignupChoiceComponent } from "@src/app/sign-up/sign-up-choice.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<SignupChoiceComponent>;

  title = "indiestuff";
  @HostListener("document:click", ["$event"])
  click(event) {
    if (this.clickoutHandler) {
      this.clickoutHandler();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignupChoiceComponent, {panelClass: 'app-signup-form-no-padding'});
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    dialogRef.afterOpened().subscribe(() => {
      console.log("here 1");
      this.clickoutHandler = this.closeDialogFromClick;
    });
  }

  closeDialogFromClick(event: MouseEvent) {
    delete this.clickoutHandler;
    this.dialogRefClassScope.close();
  }

  ngOnInit() {}
}
