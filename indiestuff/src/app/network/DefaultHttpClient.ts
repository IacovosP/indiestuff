import { HttpClient } from "@angular/common/http";
import httpClient, {
  HttpClient as HttpClientInterface,
} from "@src/app/network-core/HttpClient";
import { Observable } from "rxjs";
import auth from "@src/app/auth/Auth";

const POST_NO_AUTH_URL = ["auth"];

class DefaultHttpClient {
  public defaultHttpClient: HttpClientInterface;

  constructor(client: HttpClientInterface) {
    this.defaultHttpClient = client;
  }

  public async fetch(
    url: string,
    body?: string | FormData,
    method?: "GET" | "POST" | "DELETE",
    retryOptions?: {
      statusToRetry: number[];
      maxAttempts: number;
      delayBetweenRetries?: number;
    }
  ): Promise<any> {
    const accessToken = await this.getAccessToken();
    const match = POST_NO_AUTH_URL.filter((noAuthUrl) =>
      url.includes(noAuthUrl)
    );
    if ((method === "POST" || method === "DELETE") && !accessToken && !match) {
      Promise.reject("Authenticated POST request for unauthenticated user");
    }
    return this.defaultHttpClient.fetch(
      url,
      body,
      method,
      retryOptions,
      this.getHeaders(body instanceof FormData, accessToken)
    );
  }
  public fromFetch(
    url: string,
    body?: string | FormData,
    method?: "GET" | "POST"
  ): Observable<any> {
    return this.defaultHttpClient.fromFetch(
      url,
      body,
      method,
      this.getHeaders(body instanceof FormData)
    );
  }

  private getHeaders(isForm: boolean, accessToken?: string): Headers {
    if (isForm) {
      return accessToken
        ? new Headers({
            auth: accessToken,
          })
        : new Headers();
    }
    return accessToken
      ? new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          auth: accessToken,
        })
      : new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        });
  }

  public getAccessToken(): Promise<string | null> {
    const tokenResponse = auth.getTokenResponse();
    if (tokenResponse) {
      if (tokenResponse.expiresAt - Date.now() < 30000) {
        console.log(
          "refreshing because expiring in :" +
            (tokenResponse.expiresAt - Date.now())
        );
        return auth.refreshToken();
      }
      return Promise.resolve(tokenResponse.accessToken);
    }
    return null;
  }
}

const defaultHttpClient = new DefaultHttpClient(httpClient);

export default defaultHttpClient;
