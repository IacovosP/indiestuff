import { Component, OnInit } from '@angular/core';
import defaultHttpClient from '@src/app/network/DefaultHttpClient';
import { AlbumInterface, ArtistInterface, RecentlyPlayedPageInterface } from '../music-types/lib';

@Component({
    selector: 'donation-page',
    templateUrl: './donation-page.component.html',
    styleUrls: ['./donation-page.component.css']
})
export class DonationPageComponent implements OnInit {
    mostPlayedArtists: Array<AlbumInterface | ArtistInterface | any> = [];
    websiteDonationAmount = 0;
    websiteDonationPercentage = 0;
    totalAmount = 2;
    totalSecondsPlayedForMostPlayedArtists = 0;
    shouldShowPaymentContainer = false;

    constructor() {}

    drop(event: Event) {}

    ngOnInit() {
        this.getMyTopArtists();
    }

    getMyTopArtists() {
        defaultHttpClient
            .fetch('event/myMostPlayed')
            .then((response: RecentlyPlayedPageInterface) => {
                response.recentlyPlayed.forEach(artist => {
                    this.totalSecondsPlayedForMostPlayedArtists += (Number((artist as any).timePlayedInSeconds));
                    this.mostPlayedArtists.push({
                        ...artist,
                        timePlayedInSeconds: Number((artist as any).timePlayedInSeconds),
                        timePlayedInHours: (Number((artist as any).timePlayedInSeconds) / 3600).toFixed(2)
                    });
                });
                this.calculateAllotmentAmountForArtists();
                const imageLink = 'https://indie-image-test.s3.eu-west-2.amazonaws.com/';
            })
            .catch((err) => {
                console.error('error in getting my mostPlayed: ' + err);
            });
    }

    updateAllotmentAmount(value: number, artist: any) {
        if (Number(value) < 0 || isNaN(value)) {
            (document.getElementById('textarea' + artist.id) as any).value = artist.allotmentAmount;
            return;
        }
        this.totalAmount += Number(value) - artist.allotmentAmount;
        artist.allotmentAmount = Number(value);
        this.updateDonationPercentage({ value: this.websiteDonationPercentage });
    }

    onTextareaKeydown(event: Event, artist: any) {
        document.getElementById('textarea' + artist.id).blur();
        event.preventDefault();
    }

    calculateAllotmentAmountForArtists() {
        this.mostPlayedArtists = this.mostPlayedArtists.map(artist => {
            const allotmentPercentage = (artist.timePlayedInSeconds / this.totalSecondsPlayedForMostPlayedArtists) * 100;
            return {
                ...artist,
                allotmentPercentage: Number(allotmentPercentage.toFixed(2)),
                allotmentAmount: Number((2 * allotmentPercentage / 100).toFixed(2))
            };
        });
    }

    updateDonationPercentage(event: { value: number }) {
        this.websiteDonationPercentage = event.value;
        this.websiteDonationAmount = event.value === 0 ? 0 : Number((this.totalAmount * (this.websiteDonationPercentage / 100)).toFixed(2));
    }

    makeDonation() {
        this.shouldShowPaymentContainer = true;
        return new Promise((resolve, reject) => {
            const scripttagElement = document.createElement('script');
            scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=test';
            scripttagElement.onload = resolve;
            document.body.appendChild(scripttagElement);
        }).then(() => {
            (window as any).paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'black',
                    shape: 'rect',
                    label: 'paypal',
                    width: '50'
                }
            }).render('#payment-checkout');
        });
    }
}
