import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignupChoiceComponent } from '@src/app/sign-up/sign-up-choice.component';
import { LoginFormComponent } from '@src/app/login/login.component';
import { AuthStateEventEmitter } from '@src/app/login/loggedInEventEmitter';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import auth, { AccountType } from '../auth/Auth';

interface SearchOptions {
    title: string;
    id: string;
    type: 'ALBUM' | 'ARTIST' | 'TRACK';
}
@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
    authEventEmitter: AuthStateEventEmitter;
    subscription: any;
    searchControl: FormControl;
    isRegistered = false;
    isArtistRegistered = false;
    clickoutHandler: Function;
    dialogRefClassScope: MatDialogRef<SignupChoiceComponent | LoginFormComponent>;
    options: SearchOptions[];
    filteredOptions: Observable<SearchOptions[]>;
    searchForm: FormGroup;

    constructor(public dialog: MatDialog, authEventEmitter: AuthStateEventEmitter, private router: Router) {
        this.authEventEmitter = authEventEmitter;
    }

    logout() {
        auth.deregister();
        this.authEventEmitter.change({ isRegistered: false });
    }

    openSignupDialog() {
        const dialogRef = this.dialog.open(SignupChoiceComponent, {
            panelClass: 'app-signup-form-no-padding'
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
            panelClass: 'app-signup-form-no-padding'
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
                if (value !== '') {
                    return this.lookup(value);
                } else {
                    return of(null);
                }
            })
        );
        if (auth.getAccessToken()) {
            this.changeAuthState({ isRegistered: true });
            this.isArtistRegistered = auth.getAccountType() === AccountType.Artist;
        }
        this.subscription = this.authEventEmitter.getEmittedValue().subscribe((item) => this.changeAuthState(item));
    }

    loadOption(selected: SearchOptions) {
        this.searchControl.setValue('');
        if (selected.type === 'ALBUM') {
            this.router.navigate(['/album', selected.id]);
        } else if (selected.type === 'ARTIST') {
            this.router.navigate(['/artist', selected.id]);
        }
    }

    lookup(value: string): Observable<any> {
        return this.search(value.toLowerCase()).pipe(
            // map the item property of the github results as our return object
            map((results) => {
                const albumValues = results[0];
                const artistValues = results[1];
                const albums =
                    albumValues.albums &&
                    albumValues.albums.length > 0 &&
                    albumValues.albums.map((albumValue) => ({
                        title: albumValue.title,
                        id: albumValue.id,
                        imageName: 'https://indie-image-test.s3.eu-west-2.amazonaws.com/' + albumValue.album_image_filename,
                        type: 'ALBUM'
                    }));
                const artists =
                    artistValues.artists &&
                    artistValues.artists.length > 0 &&
                    artistValues.artists.map((artistValue) => ({
                        title: artistValue.name,
                        id: artistValue.id,
                        imageName: 'https://indie-artist-image-test.s3.eu-west-2.amazonaws.com/' + artistValue.artist_image_filename,
                        type: 'ARTIST'
                    }));
                let options = [];
                if (artists && artists.length > 0) {
                    options = [...artists];
                }
                if (albums && albums.length > 0) {
                    options = [...options, ...albums];
                }
                return options;
            }),
            // catch errors
            catchError((_) => of(null))
        );
    }
    search(text: string): Observable<Response> {
        return defaultHttpClient.fromFetch('search', JSON.stringify({ text }), 'POST').pipe(map((res: Response) => res));
    }
    changeAuthState(item: { isRegistered: boolean }) {
        this.isRegistered = item && item.isRegistered ? true : false;
        if (this.isRegistered && this.dialog) {
            this.isArtistRegistered = auth.getAccountType() === AccountType.Artist;
            this.dialog.closeAll();
        }
    }
}
