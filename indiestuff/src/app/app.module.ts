import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { TopNavComponent } from '@src/app/home/top-nav.component';

import { SignupFormComponent } from '@src/app/signup-form/signup-form.component';
import { ArtistSignupFormComponent } from '@src/app/signup-form/artist-sign-up-form.component';
import { SignupChoiceComponent } from '@src/app/sign-up/sign-up-choice.component';
import { ArtistMusicComponent } from '@src/app/artist/artist-music/artist-music.component';
import { MyNavComponent } from '@src/app/my-navbar/my-navbar.component';
import { ArtistMenuBar } from '@src/app/artist/page-menu-bar/artist-menu-bar.component';
import { AlbumListComponent } from '@src/app/artist/albums/album-list.component';
import { AlbumComponent } from '@src/app/artist/albums/album.component';
import { PageTopImageComponent } from '@src/app/page/top-image/top-image.component';
import { TrackListComponent } from '@src/app/music-types/track-list/track-list.component';
import { CommentContainerComponent } from '@src/app/comments/comments-container.component';
import { CommentboxComponent } from '@src/app/comments/commentbox/commentbox.component';
import { ChildboxComponent } from '@src/app/comments/childbox/childbox.component';
import { PlayerComponent } from '@src/app/player-ui/player.component';
import { SharedService } from '@src/app/common/shared-service';
import { PlayerEventEmitter } from '@src/app/player-ui/playerEmitter';
import { ArtistCreationPageComponent } from '@src/app/artist/artist-creation-page/artist-creation-page.component';
import { TrackUploadFormComponent } from '@src/app/artist/artist-creation-page/track-upload/track-upload-form.component';
import { CommentsComponent } from '@src/app/comments/comments/comments.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginFormComponent } from '@src/app/login/login.component';
import { AuthStateEventEmitter } from '@src/app/login/loggedInEventEmitter';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerModule } from 'ngx-color-picker';
import { AlbumPageComponent } from '@src/app/album/album-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreatePlaylistFormComponent } from './playlist/create-playlist.component';
import { MatSliderModule } from '@angular/material/slider';
import { PlaylistPageComponent } from '@src/app/playlist/playlist-page.component';
import { CommentModalContainerComponent } from '@src/app/comments/comments-container-modal.component';
import { PlaylistState } from '@src/app/playlist/playlistState';
import { RecentlyPlayedComponent } from '@src/app/mylibrary/recently-played.component';
import { MyLibraryPageComponent } from '@src/app/mylibrary/my-library-page.component';
import { HomePageComponent } from '@src/app/home/home.component';
import { MyArtistPageComponent } from '@src/app/artist/artist-creation-page/my-artist-page.component';
import { MyArtistMusicPageComponent } from '@src/app/artist/artist-creation-page/my-music/my-artist-music-page.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConfirmationDialogComponent } from '@src/app/common/confirmation-dialog/confirmation-dialog.component';
import { SettingsPageComponent } from '@src/app/user/settings-page.component';
import { ResetPasswordComponent } from '@src/app/user/reset-password/reset-password.component';
import { DonationPageComponent } from '@src/app/donation/donation-page.component';
import { MyMostPlayedComponent } from '@src/app/mylibrary/my-most-played/my-most-played.component';

@NgModule({
    declarations: [
        AppComponent,
        MyNavComponent,
        TopNavComponent,
        SignupFormComponent,
        ArtistSignupFormComponent,
        ArtistCreationPageComponent,
        ArtistMusicComponent,
        PageTopImageComponent,
        TrackListComponent,
        CommentModalContainerComponent,
        CommentContainerComponent,
        CommentsComponent,
        CommentboxComponent,
        ChildboxComponent,
        ArtistMenuBar,
        AlbumListComponent,
        AlbumComponent,
        PlayerComponent,
        SignupChoiceComponent,
        LoginFormComponent,
        TrackUploadFormComponent,
        AlbumPageComponent,
        CreatePlaylistFormComponent,
        PlaylistPageComponent,
        RecentlyPlayedComponent,
        MyMostPlayedComponent,
        MyLibraryPageComponent,
        HomePageComponent,
        MyArtistPageComponent,
        MyArtistMusicPageComponent,
        ConfirmationDialogComponent,
        SettingsPageComponent,
        ResetPasswordComponent,
        DonationPageComponent
    ],
    imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatProgressBarModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HammerModule,
        MatMenuModule,
        MatIconModule,
        ColorPickerModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        DragDropModule,
        MatSliderModule,
        MatButtonToggleModule
    ],
    entryComponents: [ChildboxComponent],
    providers: [SharedService, PlayerEventEmitter, AuthStateEventEmitter, PlaylistState],
    bootstrap: [AppComponent]
})
export class AppModule {}
