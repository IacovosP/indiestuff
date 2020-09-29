import { Routes } from "@angular/router";

import { TopNavComponent } from "@src/app/home/top-nav.component";
import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";
import { ArtistMusicComponent } from "@src/app/artist/artist-music/artist-music.component";
import { ArtistCreationPageComponent } from "@src/app/artist/artist-creation-page/artist-creation-page.component";
import { AlbumPageComponent } from "@src/app/album/album-page.component";
import { PlaylistPageComponent } from "@src/app/playlist/playlist-page.component";
import { MyLibraryPageComponent } from "@src/app/mylibrary/my-library-page.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: TopNavComponent
  },
  {
    path: "signUp",
    component: SignupFormComponent
  },
  {
    path: "artist/:id",
    component: ArtistMusicComponent
  },
  {
    path: "mypage",
    component: ArtistCreationPageComponent
  },
  {
    path: "album/:id",
    component: AlbumPageComponent
  },
  {
    path: "playlist/:id",
    component: PlaylistPageComponent
  },
  {
    path: "mylibrary",
    component: MyLibraryPageComponent
  }
];
