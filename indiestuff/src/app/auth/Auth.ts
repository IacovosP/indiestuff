export class Auth {
    accessToken: string;

    setAccessToken(jwt: string) {
        this.accessToken = jwt;
    }
    
    refreshToken() {
        // TODO
    }
}