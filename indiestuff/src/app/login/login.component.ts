import { Component, OnInit, ElementRef } from "@angular/core";
import { AuthStateEventEmitter } from "./loggedInEventEmitter";
import auth from "@src/app/auth/Auth";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { LoginUser, loginWithEmailAndPassword } from "@src/app/common/login";

@Component({
  selector: "app-login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginFormComponent implements OnInit {
  authEventEmitter: AuthStateEventEmitter;
  shouldShowForgotPasswordTail: boolean = false;

  constructor(
    public hostElement: ElementRef,
    authEventEmitter: AuthStateEventEmitter
  ) {
    this.authEventEmitter = authEventEmitter;
  }
  // Property for the user
  private user: LoginUser;
  private forgottenAccountEmail: string = "";
  private shouldShowForgotPasswordInput = false;

  ngOnInit() {
    // Create a new user object
    this.user = { email: "", password: "" };
  }

  onFormSubmit({ value, valid }: { value: LoginUser; valid: boolean }) {
    this.user = value;

    loginWithEmailAndPassword(this.user, this.authEventEmitter);
  }

  openForgotPasswordDialog() {
    this.shouldShowForgotPasswordInput = true;
  }

  verifyEmailAndSendResetEmail({ value, valid }) {
    const emailAddressForForgottenPassword = value.forgottenEmail;
    console.log("email 1: " + emailAddressForForgottenPassword);
    defaultHttpClient.fetch(
      "auth/resetPassword",
      JSON.stringify({
        email: emailAddressForForgottenPassword,
      }),
      "POST"
    );
  }
}
