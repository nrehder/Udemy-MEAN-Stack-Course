import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.component.html",
	styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
	loading: boolean = false;

	constructor(private authService: AuthService) {}

	ngOnInit() {}

	onSignup(form: NgForm) {
		this.authService.createUser(form.value.email, form.value.password);
	}
}
