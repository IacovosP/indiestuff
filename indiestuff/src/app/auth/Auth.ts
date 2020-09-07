interface TokenResponse {
  accessToken: string;
  expiresInSec: number;
}

export class Auth {
  tokenResponse: TokenResponse;

  setAccessToken(tokenResponse: { token: string; expiresIn: number }) {
    this.tokenResponse = {
      accessToken: tokenResponse.token,
      expiresInSec: tokenResponse.expiresIn,
    };
  }

  getAccessToken() {
    return this.tokenResponse ? this.tokenResponse.accessToken : null;
  }

  refreshToken() {
    // TODO
  }
}

const auth = new Auth();

export default auth;
