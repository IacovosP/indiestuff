import { Component, OnInit, ElementRef } from "@angular/core";
import { AuthStateEventEmitter } from "./loggedInEventEmitter";

interface LoginUser {
    email: string;
    password: string;
}

@Component({
  selector: "app-login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})



export class LoginFormComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;

  constructor(public hostElement: ElementRef, authEventEmitter: AuthStateEventEmitter) {
    this.authEventEmitter = authEventEmitter;
  }
  // Property for the user
  private user: LoginUser;
  ngOnInit() {
    // Create a new user object
    this.user = { email: "", password: "" };
  }

  onFormSubmit({ value, valid }: { value: LoginUser; valid: boolean }) {
    this.user = value;
    console.log(this.user);
    console.log("valid: " + valid);
    const restAPIUrl = "http://localhost:5000/auth/login";
    const requestInit: RequestInit = {
      body: JSON.stringify({
        user: this.user
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json"
      }),
      method: "POST"
    }
    fetch(restAPIUrl, requestInit)
      .then(response => {
        console.log("got a response " + JSON.stringify(response));
        this.authEventEmitter.change(response);
      })
      .catch(err => {
        console.error("got an error: " , err);
      });
  }
}
