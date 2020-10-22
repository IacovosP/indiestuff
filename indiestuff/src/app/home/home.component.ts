import { Component, OnInit } from "@angular/core";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { HomePageAlbumInterface } from "@apistuff";
import auth from "../auth/Auth";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
  albums: HomePageAlbumInterface[];
  topAlbum: HomePageAlbumInterface;

  constructor() {}

  ngOnInit() {
    this.loadHomePage();
  }

  loadHomePage() {
    defaultHttpClient
      .fetch("home/")
      .then((response) => {
        this.topAlbum = response.shift();
        this.albums = response;
      })
      .catch((error) => {
        console.error("Error in fetching home page: " + error);
      });
  }
}
