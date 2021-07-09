import httpClient from '@src/app/network-core/HttpClient';

// eslint-disable-next-line no-shadow
export enum AccountType {
    Artist = 'Artist',
    Fan = 'Fan'
}

interface TokenResponse {
    accessToken: string;
    expiresAt: number; // timestamp when token expires
    username: string;
    accountType?: AccountType;
}

const AuthStorageKey = 'AuthToken';
const RefreshTokenStorageKey = 'RefreshToken';

export class Auth {
    tokenResponse: TokenResponse;
    refreshRequestPromise: Promise<string | null>;

    constructor() {
        this.tokenResponse = this.getTokenResponse();
    }

    setAccessToken(tokenResponse: { accessToken: string; expiresIn: number; username: string; isArtist?: boolean }) {
        const accountType = this.tokenResponse && this.tokenResponse.accountType;

        this.tokenResponse = {
            accessToken: tokenResponse.accessToken,
            expiresAt: Date.now() + 60 * 60 * 1000,
            username: tokenResponse.username,
            accountType: tokenResponse.isArtist || accountType === AccountType.Artist ? AccountType.Artist : AccountType.Fan
        };
        window.localStorage.setItem('AuthToken', JSON.stringify(this.tokenResponse));
    }

    setTokenResponse(tokenResponse: { accessToken: string; expiresIn: number; username: string; refreshToken: string; isArtist?: boolean }) {
        const accountType = this.tokenResponse && this.tokenResponse.accountType;
        this.tokenResponse = {
            accessToken: tokenResponse.accessToken,
            expiresAt: Date.now() + 60 * 60 * 1000,
            username: tokenResponse.username,
            accountType: tokenResponse.isArtist || accountType === AccountType.Artist ? AccountType.Artist : AccountType.Fan
        };

        window.localStorage.setItem('AuthToken', JSON.stringify(this.tokenResponse));

        window.localStorage.setItem(RefreshTokenStorageKey, tokenResponse.refreshToken);
    }

    getTokenResponse() {
        if (this.tokenResponse) {
            return this.tokenResponse;
        } else {
            const storedTokenResponse = window.localStorage.getItem(AuthStorageKey);
            if (storedTokenResponse) {
                return JSON.parse(storedTokenResponse);
            }
        }
        return null;
    }

    getAccessToken() {
        const storedTokenResponse = window.localStorage.getItem(AuthStorageKey);
        if (storedTokenResponse) {
            const parsedAccessToken = JSON.parse(storedTokenResponse).accessToken;
            return parsedAccessToken;
        }
        return this.tokenResponse ? this.tokenResponse.accessToken : null;
    }

    getRefreshToken() {
        const storedTokenResponse = window.localStorage.getItem(RefreshTokenStorageKey);
        return storedTokenResponse;
    }

    getUsername() {
        const storedTokenResponse = window.localStorage.getItem(AuthStorageKey);
        if (storedTokenResponse) {
            const username = JSON.parse(storedTokenResponse).username;
            return username;
        }
        return this.tokenResponse ? this.tokenResponse.username : null;
    }

    getAccountType() {
        return this.tokenResponse && this.tokenResponse.accountType;
    }

    deregister() {
        window.localStorage.removeItem(AuthStorageKey);
        window.localStorage.removeItem(RefreshTokenStorageKey);
        this.tokenResponse = null;
    }

    refreshToken(): Promise<string | null> {
        const refresh_token = this.getRefreshToken();
        if (refresh_token) {
            if (this.refreshRequestPromise) {
                return this.refreshRequestPromise;
            }
            this.refreshRequestPromise = httpClient
                .fetch(
                    'auth/refreshToken',
                    JSON.stringify({
                        tokenRequest: {
                            refresh_token
                        }
                    }),
                    'POST'
                    // {statusToRetry: [500], maxAttempts: 2}
                )
                .then((response) => {
                    this.setAccessToken(response);
                    this.refreshRequestPromise = null;
                    return response.accessToken;
                })
                .catch((error) => {
                    console.error('Failed to refresh token: ' + error);
                    this.deregister();
                    return null;
                });
            return this.refreshRequestPromise;
        }
        return null;
    }
}

const auth = new Auth();

export default auth;
