import { Component, OnInit, ElementRef } from "@angular/core";
// Import the User model
import { User } from "./User";

@Component({
  selector: "app-signup-form",
  templateUrl: "./signup-form.component.html",
  styleUrls: ["./signup-form.component.css"],
})
export class SignupFormComponent implements OnInit {
  constructor(public hostElement: ElementRef) {}
  // Property for the user
  private user: User;
  ngOnInit() {
    // Create a new user object
    this.user = new User({ username: "", email: "", password: "" });
  }

  onFormSubmit({ value, valid }: { value: User; valid: boolean }) {
    this.user = value;
    console.log(this.user);
    console.log("valid: " + valid);
    const restAPIUrl = "http://localhost:5000/user";
    const requestInit: RequestInit = {
      body: JSON.stringify({
        user: this.user,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      method: "POST",
    };
    fetch(restAPIUrl, requestInit)
      .then((response) => {
        console.log("got a response " + JSON.stringify(response));
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
  }
}
