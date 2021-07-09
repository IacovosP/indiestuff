import { Component, OnInit } from '@angular/core';
import httpClient from '@src/app/network-core/HttpClient';

@Component({
    selector: 'settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {
    user: { password: string };
    username: string;

    constructor() {}

    ngOnInit() {
        this.user = {
            password: ''
        };
    }

    checkValidnessOfToken() {
        // fetch request to check if token is valid
    }

    onFormSubmit({ value, valid }: { value: any; valid: boolean }) {
        if (!valid) {
            return;
        }
        console.log('form to reset password submitted: ' + JSON.stringify(value));

        httpClient
            .fetch(
                'auth/resetChangePassword',
                JSON.stringify({
                    newPassword: value.password,
                    username: this.username
                }),
                'POST'
            )
            .then(() => {
                alert('Password successfully changed');
            })
            .catch((error) => {
                alert('Failed to changed password');
                console.error('Failed to reset-change password: ' + error);
            });
    }
}
