import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";

import { MaterialModule } from "../material/material.module";

@NgModule({
	declarations: [PostCreateComponent, PostListComponent],
	imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
})
export class PostsModule {}
