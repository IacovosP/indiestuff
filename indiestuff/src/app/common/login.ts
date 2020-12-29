import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import auth from "@src/app/auth/Auth";
import { AuthStateEventEmitter } from "@src/app/login/loggedInEventEmitter";
import { Injector } from "@angular/core";

export interface LoginUser {
  email: string;
  password: string;
}

export const loginWithEmailAndPassword = (
  user: LoginUser,
  authEventEmitter: AuthStateEventEmitter
) => {
  defaultHttpClient
    .fetch("auth/login", JSON.stringify({ user }), "POST")
    .then((response) => {
      console.log("got a response " + JSON.stringify(response));
      auth.setTokenResponse(response);
      authEventEmitter.change({ isRegistered: true });
    })
    .catch((err) => {
      console.error("got an error: ", err);
    });
};
