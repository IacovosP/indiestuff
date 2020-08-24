import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

// Import the User model
import { Artist } from "./User";

@Component({
  selector: "app-artist-sign-up-form",
  templateUrl: "./artist-sign-up-form.component.html",
  styleUrls: ["./artist-sign-up-form.component.css"],
})
export class ArtistSignupFormComponent implements OnInit {
  constructor(public hostElement: ElementRef, private router: Router) {}
  // Property for the user
  private user: Artist;
  ngOnInit() {
    // Create a new user object
    this.user = new Artist({ artistName: "", username: "", email: "", password: "" });
  }

  onFormSubmit({ value, valid }: { value: Artist; valid: boolean }) {
    this.user = value;
    console.log(this.user);
    console.log("valid: " + valid);
    window.location.href = '/myartistpage';
  }
}
