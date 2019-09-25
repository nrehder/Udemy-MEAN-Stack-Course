import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
	private authStatus = false;
	private token: string;
	private authStatusListener = new Subject<boolean>();
	private logoutTimer: any;

	constructor(private httpClient: HttpClient, private router: Router) {}

	autoLoginUser() {
		const authInfo = this.loadAuthData();
		if (!authInfo) return;
		const now = new Date();
		const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

		if (expiresIn > 0) {
			this.token = authInfo.token;
			this.authStatus = true;
			this.authStatusListener.next(true);
			this.setLogoutTimer(expiresIn);
		}
	}

	createUser(email: string, password: string) {
		this.httpClient
			.post("http://localhost:3000/api/user/signup", {
				email,
				password,
			})
			.subscribe(res => {
				console.log(res);
			});
	}

	loginUser(email: string, password: string) {
		this.httpClient
			.post<{ token: string; expiresIn: number }>(
				"http://localhost:3000/api/user/login",
				{
					email,
					password,
				}
			)
			.subscribe(res => {
				this.token = res.token;
				if (this.token) {
					const expiresIn = res.expiresIn;
					//creates auto logout timer
					this.setLogoutTimer(expiresIn);

					//updates auth status and notifies other components
					this.authStatus = true;
					this.authStatusListener.next(true);

					//saves auth data to local storage
					const now = new Date();
					const expirationDate = new Date(now.getTime() + expiresIn);
					this.saveAuthData(this.token, expirationDate);

					//navigates to home page
					this.router.navigate(["/"]);
				}
			});
	}

	logoutUser() {
		this.token = null;
		this.authStatus = false;
		this.authStatusListener.next(false);
		this.router.navigate(["/"]);
		clearTimeout(this.logoutTimer);
		this.clearAuthData();
	}

	private saveAuthData(token: string, expirationDate: Date) {
		localStorage.setItem("token", token);
		localStorage.setItem("expiration", expirationDate.toISOString());
	}

	private clearAuthData() {
		localStorage.removeItem("token");
		localStorage.removeItem("expiration");
	}

	private loadAuthData() {
		const token = localStorage.getItem("token");
		const expirationDate = localStorage.getItem("expiration");

		if (!token || !expirationDate) {
			return;
		}
		return {
			token,
			expirationDate: new Date(expirationDate),
		};
	}

	private setLogoutTimer(duration: number) {
		this.logoutTimer = setTimeout(() => {
			this.logoutUser();
		}, duration);
	}

	//Getters
	getToken() {
		return this.token;
	}
	getAuthStatusListener() {
		return this.authStatusListener.asObservable();
	}
	getAuthStatus() {
		return this.authStatus;
	}
}
