import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.component.html",
	styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit, OnDestroy {
	loading: boolean = false;
	authStatusSubs: Subscription;

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authStatusSubs = this.authService
			.getAuthStatusListener()
			.subscribe(status => {
				if (!status) {
					this.loading = false;
				}
			});
	}
	ngOnDestroy() {
		this.authStatusSubs.unsubscribe();
	}

	onSignup(form: NgForm) {
		this.loading = true;
		this.authService.createUser(form.value.email, form.value.password);
	}
}
