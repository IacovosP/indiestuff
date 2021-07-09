import { Component, OnInit } from '@angular/core';
import httpClient from '@src/app/network-core/HttpClient';

@Component({
    selector: 'donation-page',
    templateUrl: './donation-page.component.html',
    styleUrls: ['./donation-page.component.css']
})
export class DonationPageComponent implements OnInit {
    artists = [{ name: 'iacovos' }, { name: 'bandman' }];

    constructor() {}

    drop(event: Event) {}

    ngOnInit() {}
}
