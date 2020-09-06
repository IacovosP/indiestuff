class HttpClient {
    public fetch(url: string, body?: string | FormData, method?: "GET" | "POST"): Promise<Response> {
        const requestUrl = `http://localhost:5000/${url}`
        const requestInit: RequestInit = {
            body,
            headers: new Headers({
              "Content-Type": "application/json",
              Accept: "application/json"
            }),
            method
          }
        return fetch(requestUrl, requestInit).then(response => response.json());
    }
}

const httpClient = new HttpClient()

export default httpClient;