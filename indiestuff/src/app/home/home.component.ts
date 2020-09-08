import { Component, OnInit, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SignupChoiceComponent } from "@src/app/sign-up/sign-up-choice.component";
import { LoginFormComponent } from "@src/app/login/login.component";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {startWith, map} from 'rxjs/operators';
import { Router } from "@angular/router";
import httpClient from "../network/HttpClient";

interface SearchOptions {
  name: string;
  id: number;
  type: "ALBUM" | "ARTIST" | "TRACK";
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;
  subscription: any;
  searchControl: FormControl;
  constructor(
    public dialog: MatDialog,
    authEventEmitter: AuthStateEventEmitter,
    private router: Router
  ) {
    this.authEventEmitter = authEventEmitter;
  }
  clickoutHandler: Function;
  dialogRefClassScope: MatDialogRef<SignupChoiceComponent | LoginFormComponent>;
  options: SearchOptions[];
  filteredOptions: Observable<SearchOptions[]>;
  searchForm: FormGroup;

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
    this.searchControl = new FormControl();
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      map(value => {
        console.log("value: " + value);
        return this._filter(value);
      })
    );
    this.subscription = this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
  }

  private _filter(value: string): SearchOptions[] {
    const filterValue = this._normalizeValue(value);
    try {
      this.search(value);
      return this.options.filter(option => this._normalizeValue(option.name).includes(filterValue));
    } catch (err) {
      console.log("no findings: " + err);
    }
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  loadOption(selected: SearchOptions) {
    console.log("selected:" + JSON.stringify(selected));
    if (selected.type === "ALBUM") {
      this.router.navigate(['/album', selected.id]); 
    }
  }

  search(text: string) {
    return httpClient.fetch("search", JSON.stringify({text}), "POST")
    .then(response => {
      const values = response[0];
      console.log("values ads: " + JSON.stringify(values.albums));
      this.options = values.albums.map(value => ({
        name: value.name,
        id: value.id,
        type: "ALBUM"
      }));
    })
    .catch(err => {
      console.error("error in searching: " + err);
    })
  }
  changeAuthState(item: any) {
    console.log("received auth state change: " + JSON.stringify(item));
  }
}
