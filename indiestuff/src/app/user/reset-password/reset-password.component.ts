import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import auth from "@src/app/auth/Auth";
import httpClient from "@src/app/network-core/HttpClient";

@Component({
  selector: "reset-password-component",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  private user: {password: string};
  resetToken: string;
  username: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.user = {
      password: ""
    }

    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.username = params['username'];
      if (!this.resetToken || !this.username || auth.getAccessToken()) {
        console.log("navigating home even though we tried to go to reset page");
        this.router.navigate(["/home"]);
        return;
      }
      this.checkValidnessOfToken();
    });
  }

  checkValidnessOfToken() {
    // fetch request to check if token is valid
  }

  onFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      return;
    }
    console.log("form to reset password submitted: " + JSON.stringify(value));

    httpClient.fetch(
      "auth/resetChangePassword", 
      JSON.stringify({newPassword: value.password, username: this.username}), 
      "POST", 
      undefined,
      new Headers({ 
        auth: this.resetToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      }))
    .then(() => {
      alert("password successfully changed");
      this.router.navigate(["/home"]);
    })
    .catch(error => {
      alert("failed to change password")
      console.error("Failed to reset-change password: " + error);
      this.router.navigate(["/home"]);
    });
  }
}
