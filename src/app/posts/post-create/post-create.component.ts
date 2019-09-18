import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";

@Component({
	selector: "app-post-create",
	templateUrl: "./post-create.component.html",
	styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent {
	constructor(private postsService: PostsService) {}

	onAddPost(form: NgForm) {
		this.postsService.addPost(form.value.title, form.value.content);
	}
}
