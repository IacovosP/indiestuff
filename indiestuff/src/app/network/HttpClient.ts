import auth from "../auth/Auth";
import { fromFetch } from "rxjs/fetch";
import { Observable } from "@nativescript/core";
import { switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";

class HttpClient {
  public fetch(
    url: string,
    body?: string | FormData,
    method: "GET" | "POST" = "GET"
  ): Promise<any> {
    const requestUrl = `http://localhost:5000/${url}`;
    const requestInit: RequestInit = {
      body,
      headers: auth.getAccessToken()
        ? new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            auth: auth.getAccessToken(),
          })
        : new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
      method,
    };
    return fetch(requestUrl, requestInit).then((response) => response.json());
  }

  public fromFetch(
    url: string,
    body?: string | FormData,
    method: "GET" | "POST" = "GET"
  ) {
    const requestUrl = `http://localhost:5000/${url}`;
    const requestInit = {
      observe: "response",
      body,
      headers: auth.getAccessToken()
        ? new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            auth: auth.getAccessToken(),
          })
        : new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
      method,
    };
    return fromFetch(requestUrl, requestInit).pipe(
      switchMap((response) => {
        if (response.ok) {
          // OK return data
          return response.json();
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError((err) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message });
      })
    );
  }
}

const httpClient = new HttpClient();

export default httpClient;
