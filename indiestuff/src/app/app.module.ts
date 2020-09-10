import { NgModule } from "@angular/core";
import { BrowserModule, HammerModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "@src/app/app-routing.module";
import { AppComponent } from "@src/app/app.component";
import { HomeComponent } from "@src/app/home/home.component";

import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";
import { ArtistSignupFormComponent } from "@src/app/signup-form/artist-sign-up-form.component";
import { SignupChoiceComponent } from "@src/app/sign-up/sign-up-choice.component";
import { ArtistMusicComponent } from "@src/app/artist/artist-music/artist-music.component";
import { MyNavComponent } from "@src/app/my-navbar/my-navbar.component";
import { ArtistMenuBar } from "@src/app/artist/page-menu-bar/artist-menu-bar.component";
import { AlbumListComponent } from "@src/app/artist/albums/album-list.component";
import { AlbumComponent } from "@src/app/artist/albums/album.component";
import { PageTopImageComponent } from "@src/app/page/top-image/top-image.component";
import { TrackListComponent } from "@src/app/music-types/track-list/track-list.component";
import { CommentContainerComponent } from "@src/app/comments/comments-container.component";
import { CommentboxComponent } from "@src/app/comments/commentbox/commentbox.component";
import { ChildboxComponent } from "@src/app/comments/childbox/childbox.component";
import { PlayerComponent } from "@src/app/player-ui/player.component";
import { SharedService } from "@src/app/common/shared-service";
import { PlayerEventEmitter } from "@src/app/player-ui/playerEmitter";
import { ArtistCreationPageComponent } from "@src/app/artist/artist-creation-page/artist-creation-page.component";
import { TrackUploadFormComponent } from "@src/app/artist/artist-creation-page/track-upload/track-upload-form.component";
import {
  CommentsComponent,
  DatacontainerDirective,
} from "@src/app/comments/comments/comments.component";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { LoginFormComponent } from "@src/app/login/login.component";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { ColorPickerModule } from "ngx-color-picker";
import { AlbumPageComponent } from "@src/app/album/album-page.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    MyNavComponent,
    HomeComponent,
    SignupFormComponent,
    ArtistSignupFormComponent,
    ArtistCreationPageComponent,
    ArtistMusicComponent,
    PageTopImageComponent,
    TrackListComponent,
    CommentContainerComponent,
    CommentsComponent,
    DatacontainerDirective,
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
  ],
  entryComponents: [ChildboxComponent],
  providers: [SharedService, PlayerEventEmitter, AuthStateEventEmitter],
  bootstrap: [AppComponent],
})
export class AppModule {}
