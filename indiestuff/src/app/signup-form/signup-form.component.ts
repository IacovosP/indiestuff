import { Component, OnInit, ElementRef } from '@angular/core';
import httpClient from '@src/app/network-core/HttpClient';
import { loginWithEmailAndPassword } from '@src/app/common/login';
// Import the User model
import { User } from './User';
import { AuthStateEventEmitter } from '@src/app/login/loggedInEventEmitter';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
    authEventEmitter: AuthStateEventEmitter;
    // Property for the user
    user: User;

    constructor(public hostElement: ElementRef, authEventEmitter: AuthStateEventEmitter, public dialogRef: MatDialogRef<SignupFormComponent>) {
        this.authEventEmitter = authEventEmitter;
    }

    ngOnInit() {
        // Create a new user object
        this.user = new User({ username: '', email: '', password: '' });
    }

    onFormSubmit({ value, valid }: { value: User; valid: boolean }) {
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
