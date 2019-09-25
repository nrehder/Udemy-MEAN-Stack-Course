import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
	private authStatusSubs: Subscription;
	authStatus: boolean = false;

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authStatus = this.authService.getAuthStatus();
		this.authStatusSubs = this.authService
			.getAuthStatusListener()
			.subscribe(status => {
				this.authStatus = status;
			});
	}

	ngOnDestroy() {
		this.authStatusSubs.unsubscribe();
	}

	onLogout() {
		this.authService.logoutUser();
	}
}
