import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { MaterialModule } from "./material/material.module";
import { HeaderComponent } from "./header/header.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

@NgModule({
	declarations: [
		AppComponent,
		PostCreateComponent,
		HeaderComponent,
		PostListComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule,
		MaterialModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
