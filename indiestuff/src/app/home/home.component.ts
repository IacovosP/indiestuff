import { Component, OnInit, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SignupChoiceComponent } from "@src/app/sign-up/sign-up-choice.component";
import { LoginFormComponent } from "@src/app/login/login.component";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;
  subscription: any;
  constructor(public dialog: MatDialog, authEventEmitter: AuthStateEventEmitter) {
    this.authEventEmitter = authEventEmitter;
  }
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<SignupChoiceComponent|LoginFormComponent>;

  title = "indiestuff";
  @HostListener("document:click", ["$event"])
  click(event) {
    if (this.clickoutHandler) {
      this.clickoutHandler();
    }
  }

  openSignupDialog() {
    const dialogRef = this.dialog.open(SignupChoiceComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    dialogRef.afterOpened().subscribe(() => {
      console.log("here 1");
      this.clickoutHandler = this.closeDialogFromClick;
    });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginFormComponent, {
      panelClass: "app-signup-form-no-padding",
    });
    this.dialogRefClassScope = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    // dialogRef.afterOpened().subscribe(() => {
    //   console.log("here 1");
    //   this.clickoutHandler = this.closeDialogFromClick;
    // });
  }

  closeDialogFromClick(event: MouseEvent) {
    delete this.clickoutHandler;
    this.dialogRefClassScope.close();
  }

  ngOnInit() {
    this.subscription = this.authEventEmitter
    .getEmittedValue()
    .subscribe((item) => this.changeAuthState(item));
  }
  
  changeAuthState(item: any) {
    console.log("received auth state change: " + JSON.stringify(item));
  }
}
