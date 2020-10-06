import { Component, OnInit } from "@angular/core";
import httpClient from "../network/HttpClient";
import { HomePageAlbumInterface } from "@apistuff";

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
    httpClient
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
