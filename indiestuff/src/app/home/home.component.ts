import { Component, HostListener, OnInit } from "@angular/core";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { HomePageAlbumInterface } from "@src/app/music-types/lib";
import auth from "../auth/Auth";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
  albums: HomePageAlbumInterface[];
  topAlbum: HomePageAlbumInterface;
  innerWidthMain: string;
  innerWidthSide: string;
  innerWidthSideForTop: string;
  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidthMain = window.innerWidth ? (window.innerWidth / 3).toString() + 'px' : '800px';
    this.innerWidthSide = window.innerWidth ? (window.innerWidth / 6).toString() + 'px' : '398px';
    this.innerWidthSideForTop = window.innerWidth ? (window.innerWidth / 12).toString() + 'px' : '199px';
  }

  ngOnInit() {
    this.loadHomePage();
    this.innerWidthMain = window.innerWidth ? (window.innerWidth / 3).toString() + 'px' : '800px';
    this.innerWidthSide = window.innerWidth ? (window.innerWidth / 6).toString() + 'px' : '398px';
    this.innerWidthSideForTop = window.innerWidth ? (window.innerWidth / 12).toString() + 'px' : '199px';
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
