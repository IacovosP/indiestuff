import { Routes } from "@angular/router";

import { HomeComponent } from "@src/app/home/home.component";
import { SignupFormComponent } from "@src/app/signup-form/signup-form.component";
import { ArtistMusicComponent } from "@src/app/artist/artist-music/artist-music.component";
import { ArtistCreationPageComponent } from "@src/app/artist/artist-creation-page/artist-creation-page.component";
import { AlbumPageComponent } from "@src/app/album/album-page.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "signUp",
    component: SignupFormComponent,
  },
  {
    path: "artist",
    component: ArtistMusicComponent,
  },
  {
    path: "myartistpage",
    component: ArtistCreationPageComponent,
  },
  {
    path: "album",
    component: AlbumPageComponent,
  },
];
