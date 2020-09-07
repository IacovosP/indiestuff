import auth from "../auth/Auth";

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
}

const httpClient = new HttpClient();

export default httpClient;
