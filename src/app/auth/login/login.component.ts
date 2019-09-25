import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
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

	onLogin(form: NgForm) {
		this.loading = true;
		this.authService.loginUser(form.value.email, form.value.password);
	}
}
