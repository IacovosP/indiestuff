import auth from "../auth/Auth";
import { fromFetch } from "rxjs/fetch";
import { Observable } from "@nativescript/core";
import { switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";
import * as pRetry from "p-retry";
import * as delay from "delay";

export const REST_URL_PROD = "https://api.indiestavf.com";
export const REST_URL_DEV = "http://localhost:5000";

export class HttpClient {
  public fetch(
    url: string,
    body?: string | FormData,
    method: "GET" | "POST" | "DELETE" = "GET",
    retryOptions?: {
      statusToRetry: number[];
      maxAttempts: number;
      delayBetweenRetries?: number;
    },
    headers?: Headers
  ): Promise<any> {
    const requestUrl = `${REST_URL_PROD}/${url}`;
    let requestInit: RequestInit = {
      body,
      headers,
      method,
    };
    if (!(body instanceof FormData) && !headers) {
      requestInit = {
        ...requestInit,
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      };
    }

    const executeFetch = async () => {
      const response = await fetch(requestUrl, requestInit);

      // Abort retrying if the resource doesn't exist
      if (!retryOptions.statusToRetry.includes(response.status)) {
        throw new pRetry.AbortError(response.statusText);
      }
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    };
    if (retryOptions) {
      return pRetry(executeFetch, {
        onFailedAttempt: async (error) => {
          console.log(
            `[HttpError][Url: ${url}][Payload: ${body}] - Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
          );
          if (retryOptions.delayBetweenRetries) {
            await delay(retryOptions.delayBetweenRetries);
          }
        },
        retries: retryOptions.maxAttempts,
      });
    } else {
      return fetch(requestUrl, requestInit).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    }
  }

  public fromFetch(
    url: string,
    body?: string | FormData,
    method: "GET" | "POST" = "GET",
    headers?: Headers
  ) {
    const requestUrl = `${REST_URL_PROD}/${url}`;
    let requestInit: RequestInit = {
      body,
      headers,
      method,
    };
    if (!headers) {
      requestInit = {
        ...requestInit,
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      };
    }
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
