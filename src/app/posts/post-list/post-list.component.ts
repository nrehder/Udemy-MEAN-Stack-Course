import { Component, Input, OnInit, OnDestroy } from "@angular/core";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-post-list",
	templateUrl: "./post-list.component.html",
	styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
	posts: Post[] = [];
	postSubscription: Subscription;

	constructor(private postsService: PostsService) {}

	ngOnInit() {
		this.posts = this.postsService.getPosts();
		this.postSubscription = this.postsService
			.getPostUpdateListener()
			.subscribe((updatedPosts: Post[]) => {
				this.posts = updatedPosts;
			});
	}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
	}
}
