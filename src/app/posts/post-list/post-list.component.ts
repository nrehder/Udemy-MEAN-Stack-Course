import { Component, OnInit, OnDestroy } from "@angular/core";

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
	loading: boolean = false;

	constructor(private postsService: PostsService) {}

	ngOnInit() {
		this.postsService.getPosts();
		this.loading = true;
		this.postSubscription = this.postsService
			.getPostUpdateListener()
			.subscribe((updatedPosts: Post[]) => {
				this.loading = false;
				this.posts = updatedPosts;
			});
	}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
	}

	onEdit(index: number) {
		console.log("edit post " + index);
	}
	onDelete(id: string) {
		this.postsService.deletePost(id);
	}
}
