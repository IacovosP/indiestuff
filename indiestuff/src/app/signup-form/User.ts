export class User {
    username: string;
    email: string;
    password: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class Artist {
    artistName: string;
    username: string;
    email: string;
    password: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
