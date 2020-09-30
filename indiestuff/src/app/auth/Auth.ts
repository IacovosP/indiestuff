interface TokenResponse {
  accessToken: string;
  expiresInSec: number;
  username: string;
}

const AuthStorageKey = "AuthToken";

export class Auth {
  tokenResponse: TokenResponse;

  setAccessToken(tokenResponse: { token: string; expiresIn: number; username: string }) {
    this.tokenResponse = {
      accessToken: tokenResponse.token,
      expiresInSec: tokenResponse.expiresIn,
      username: tokenResponse.username
    };

    window.localStorage.setItem("AuthToken", JSON.stringify(this.tokenResponse));
  }

  getAccessToken() {
    const storedTokenResponse = window.localStorage.getItem(AuthStorageKey);
    if (storedTokenResponse) {
      const parsedAccessToken = JSON.parse(storedTokenResponse).accessToken;
      return parsedAccessToken;
    }
    return this.tokenResponse ? this.tokenResponse.accessToken : null;
  }

  getUsername() {
    const storedTokenResponse = window.localStorage.getItem(AuthStorageKey);
    if (storedTokenResponse) {
      const username = JSON.parse(storedTokenResponse).username;
      return username;
    }
    return this.tokenResponse ? this.tokenResponse.username : null;
  }

  deregister() {
    window.localStorage.removeItem(AuthStorageKey);
  }

  refreshToken() {
    // TODO
  }
}

const auth = new Auth();

export default auth;
