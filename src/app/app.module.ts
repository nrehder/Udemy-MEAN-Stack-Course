//Angular Imports
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

//Modules
import { MaterialModule } from "./material/material.module";
import { AppRoutingModule } from "./app-routing.module";

//Components
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";

//Directives, Interceptors, etc
import { AuthInterceptor } from "./auth/auth-interceptor";

@NgModule({
	declarations: [
		AppComponent,
		PostCreateComponent,
		HeaderComponent,
		PostListComponent,
		SignupComponent,
		LoginComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		ReactiveFormsModule,
		FormsModule,
		BrowserAnimationsModule,
		MaterialModule,
		AppRoutingModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
