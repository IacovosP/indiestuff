export class User {
  username: string;
  email: string;
  // Both the passwords are in a single object
  password: string;

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}
