import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "@src/app/app-routing.module";
import { AppComponent } from "@src/app/app.component";
import { HomeComponent } from "@src/app/home/home.component";

import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";
import { ArtistMusicComponent } from "@src/app/artist/artist-music/artist-music.component";
import { MyNavComponent } from "@src/app/my-navbar/my-navbar.component";
import { ArtistMenuBar } from "@src/app/artist/page-menu-bar/artist-menu-bar.component";
import { PageTopImageComponent } from "@src/app/page/top-image/top-image.component";
import { TrackListComponent } from "@src/app/music-types/track-list/track-list.component";
import { CommentContainerComponent } from "@src/app/comments/comments-container.component";
import { CommentboxComponent } from "@src/app/comments/commentbox/commentbox.component";
import { ChildboxComponent } from "@src/app/comments/childbox/childbox.component";
import {
  CommentsComponent,
  DatacontainerDirective,
} from "@src/app/comments/comments/comments.component";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  entryComponents: [ChildboxComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
