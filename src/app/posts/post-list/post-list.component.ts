import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
	selector: "app-post-list",
	templateUrl: "./post-list.component.html",
	styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
	private postSubscription: Subscription;
	posts: Post[] = [];
	loading: boolean = false;

	//pagination variables
	totalPosts = 0;
	postsPerPage = 2;
	pageSizeOptions = [1, 2, 5, 10];
	currentPage = 1;

	constructor(private postsService: PostsService) {}

	ngOnInit() {
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
		this.loading = true;
		this.postSubscription = this.postsService
			.getPostUpdateListener()
			.subscribe((updatedPosts: { posts: Post[]; postCount: number }) => {
				this.loading = false;
				this.posts = updatedPosts.posts;
				this.totalPosts = updatedPosts.postCount;
			});
	}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
	}

	onEdit(index: number) {
		console.log("edit post " + index);
	}
	onDelete(id: string) {
		this.loading = true;
		this.postsService.deletePost(id).subscribe(res => {
			this.postsService.getPosts(this.postsPerPage, this.currentPage);
		});
	}

	onChangePage(pageData: PageEvent) {
		this.loading = true;
		this.postsPerPage = pageData.pageSize;
		this.currentPage = pageData.pageIndex + 1;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
	}
}
