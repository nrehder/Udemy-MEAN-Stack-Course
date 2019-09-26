import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";

const routes = [
	{ path: "", component: PostListComponent },
	{
		path: "create",
		component: PostCreateComponent,
		canActivate: [AuthGuard],
	},
	{
		path: "edit/:id",
		component: PostCreateComponent,
		canActivate: [AuthGuard],
	},
	{
		path: "user",
		loadChildren: "./auth/auth.module#AuthModule",
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [AuthGuard],
})
export class AppRoutingModule {}
