import { NgModule } from "@angular/core";
import { BrowserModule, HammerModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "@src/app/app-routing.module";
import { AppComponent } from "@src/app/app.component";
import { HomeComponent } from "@src/app/home/home.component";

import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";
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
import {
  CommentsComponent,
  DatacontainerDirective,
} from "@src/app/comments/comments/comments.component";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    MyNavComponent,
    HomeComponent,
    SignupFormComponent,
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
    PlayerComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressBarModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HammerModule
  ],
  entryComponents: [ChildboxComponent],
  providers: [SharedService],
  bootstrap: [AppComponent],
})
export class AppModule {}
