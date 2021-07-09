import { Routes } from '@angular/router';

import { SignupFormComponent } from '@src/app/signup-form/signup-form.component';
import { ArtistMusicComponent } from '@src/app/artist/artist-music/artist-music.component';
import { MyArtistPageComponent } from '@src/app/artist/artist-creation-page/my-artist-page.component';
import { AlbumPageComponent } from '@src/app/album/album-page.component';
import { PlaylistPageComponent } from '@src/app/playlist/playlist-page.component';
import { MyLibraryPageComponent } from '@src/app/mylibrary/my-library-page.component';
import { HomePageComponent } from '@src/app/home/home.component';
import { ArtistCreationPageComponent } from '@src/app/artist/artist-creation-page/artist-creation-page.component';
import { SettingsPageComponent } from '@src/app/user/settings-page.component';
import { ResetPasswordComponent } from '@src/app/user/reset-password/reset-password.component';
import { DonationPageComponent } from '@src/app/donation/donation-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePageComponent
    },
    {
        path: 'signUp',
        component: SignupFormComponent
    },
    {
        path: 'artist/:id',
        component: ArtistMusicComponent
    },
    {
        path: 'mypage',
        component: MyArtistPageComponent
    },
    {
        path: 'album/:id',
        component: AlbumPageComponent
    },
    {
        path: 'playlist/:id',
        component: PlaylistPageComponent
    },
    {
        path: 'mylibrary',
        component: MyLibraryPageComponent
    },
    {
        path: 'settings/reset',
        component: ResetPasswordComponent
    },
    {
        path: 'settings',
        component: SettingsPageComponent
    },
    {
        path: 'mypage/add',
        component: ArtistCreationPageComponent
    },
    {
        path: 'donation',
        component: DonationPageComponent
    }
];
