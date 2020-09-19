import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SignupChoiceComponent } from "@src/app/sign-up/sign-up-choice.component";
import { LoginFormComponent } from "@src/app/login/login.component";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, catchError, debounceTime, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import httpClient from "../network/HttpClient";
import auth, { Auth } from "../auth/Auth";

interface SearchOptions {
  title: string;
  id: string;
  type: "ALBUM" | "ARTIST" | "TRACK";
}
@Component({
  selector: "app-top-nav",
  templateUrl: "./top-nav.component.html",
  styleUrls: ["./top-nav.component.css"],
})
export class TopNavComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;
  subscription: any;
  searchControl: FormControl;
  isRegistered: boolean = false;

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

  logout() {
    auth.deregister();
    this.authEventEmitter.change({ isRegistered: false });
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
  }

  closeDialogFromClick(event: MouseEvent) {
    delete this.clickoutHandler;
    this.dialogRefClassScope.close();
  }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap((value) => {
        if (value !== "") {
          return this.lookup(value);
        } else {
          return of(null);
        }
      })
    );
    if (auth.getAccessToken()) {
      this.changeAuthState({isRegistered: true});
    }
    this.subscription = this.authEventEmitter
      .getEmittedValue()
      .subscribe((item) => this.changeAuthState(item));
  }

  loadOption(selected: SearchOptions) {
    console.log("selected:" + JSON.stringify(selected));
    this.searchControl.setValue("");
    if (selected.type === "ALBUM") {
      this.router.navigate(["/album", selected.id]);
    } else if (selected.type === "ARTIST") {
      this.router.navigate(["/artist", selected.id]);
    }
  }

  lookup(value: string): Observable<any> {
    return this.search(value.toLowerCase()).pipe(
      // map the item property of the github results as our return object
      map((results) => {
        const albumValues = results[0];
        const artistValues = results[1];
        console.log("values ads: " + JSON.stringify(albumValues));
        console.log("values arts: " + JSON.stringify(artistValues.artists));
        const albums =
          albumValues.albums &&
          albumValues.albums.length > 0 &&
          albumValues.albums.map((value) => ({
            title: value.title,
            id: value.id,
            type: "ALBUM",
          }));
        const artists =
          artistValues.artists &&
          artistValues.artists.length > 0 &&
          artistValues.artists.map((value) => ({
            title: value.name,
            id: value.id,
            type: "ARTIST",
          }));
        console.log("artists: " + JSON.stringify(artists));
        let options = [];
        if (artists && artists.length > 0) {
          options = [...artists];
        }
        console.log("artists: " + JSON.stringify(options));
        if (albums && albums.length > 0) {
          console.log("Options: " + JSON.stringify(options));
          console.log("albums: " + JSON.stringify(albums));
          options = [...options, ...albums];
        }
        console.log("Options: " + JSON.stringify(options));
        return options;
      }),
      // catch errors
      catchError((_) => {
        return of(null);
      })
    );
  }
  search(text: string): Observable<Response> {
    return httpClient
      .fromFetch("search", JSON.stringify({ text }), "POST")
      .pipe(
        map((res: Response) => {
          console.log("response: " + JSON.stringify(res.body));
          return res;
        })
      );
  }
  changeAuthState(item: {isRegistered: boolean}) {
    this.isRegistered = item && item.isRegistered ? true : false;
  }
}
