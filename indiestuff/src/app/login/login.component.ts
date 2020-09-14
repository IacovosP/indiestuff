import { Component, OnInit, ElementRef } from "@angular/core";
import { AuthStateEventEmitter } from "./loggedInEventEmitter";
import auth from "@src/app/auth/Auth";
import httpClient from "@src/app/network/HttpClient";

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

  constructor(
    public hostElement: ElementRef,
    authEventEmitter: AuthStateEventEmitter
  ) {
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

    httpClient
      .fetch("auth/login", JSON.stringify({ user: this.user }), "POST")
      .then((response) => {
        console.log("got a response " + JSON.stringify(response));
        auth.setAccessToken(response);
        this.authEventEmitter.change({isRegistered: true});
      })
      .catch((err) => {
        console.error("got an error: ", err);
      });
  }
}
