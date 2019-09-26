import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";

import { MaterialModule } from "../material/material.module";

const routes = [
	{ path: "login", component: LoginComponent },
	{ path: "signup", component: SignupComponent },
];
@NgModule({
	declarations: [SignupComponent, LoginComponent],
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		RouterModule.forChild(routes),
	],
})
export class AuthModule {}
