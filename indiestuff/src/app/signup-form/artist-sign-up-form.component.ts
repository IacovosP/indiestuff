import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import httpClient from '@src/app/network-core/HttpClient';
import { AuthStateEventEmitter } from '@src/app/login/loggedInEventEmitter';

// Import the User model
import { Artist } from './User';
import { loginWithEmailAndPassword } from '@src/app/common/login';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-artist-sign-up-form',
    templateUrl: './artist-sign-up-form.component.html',
    styleUrls: ['./artist-sign-up-form.component.css']
})
export class ArtistSignupFormComponent implements OnInit {
    authEventEmitter: AuthStateEventEmitter;
    // Property for the user
    user: Artist;

    constructor(public hostElement: ElementRef, private router: Router, authEventEmitter: AuthStateEventEmitter, public dialogRef: MatDialogRef<ArtistSignupFormComponent>) {
        this.authEventEmitter = authEventEmitter;
    }

    ngOnInit() {
        // Create a new user object
        this.user = new Artist({
            artistName: '',
            username: '',
            email: '',
            password: ''
        });
    }

    onFormSubmit({ value, valid }: { value: Artist; valid: boolean }) {
        this.user = value;
        const body = JSON.stringify({
            user: this.user
        });
        httpClient
            .fetch('user', body, 'POST')
            .then((response) => {
                loginWithEmailAndPassword({ email: this.user.email, password: this.user.password }, this.authEventEmitter);
                this.dialogRef.close(true);
            })
            .catch((err) => {
                console.error('got an error: ', err);
            });
    }
}
