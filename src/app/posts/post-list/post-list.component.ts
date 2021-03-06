import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";

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

	//Authorization variables
	private authStatusSubs: Subscription;
	authStatus: boolean = false;
	userId: string;

	constructor(
		private postsService: PostsService,
		private authService: AuthService
	) {}

	ngOnInit() {
		//Post loading
		this.loading = true;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
		this.postSubscription = this.postsService
			.getPostUpdateListener()
			.subscribe((updatedPosts: { posts: Post[]; postCount: number }) => {
				this.loading = false;
				this.posts = updatedPosts.posts;
				this.totalPosts = updatedPosts.postCount;
			});

		//Authorization loading
		this.authStatus = this.authService.getAuthStatus();
		this.userId = this.authService.getUserId();
		this.authStatusSubs = this.authService
			.getAuthStatusListener()
			.subscribe(status => {
				this.authStatus = status;
				this.userId = this.authService.getUserId();
			});
	}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
		this.authStatusSubs.unsubscribe();
	}

	onEdit(index: number) {
		console.log("edit post " + index);
	}
	onDelete(id: string) {
		this.loading = true;
		let numPosts = this.posts.length;
		this.postsService.deletePost(id).subscribe(
			res => {
				if (numPosts === 1 && this.currentPage > 1) {
					this.currentPage--;
				}
				this.postsService.getPosts(this.postsPerPage, this.currentPage);
			},
			err => {
				this.loading = false;
			}
		);
	}

	onChangePage(pageData: PageEvent) {
		this.loading = true;
		this.postsPerPage = pageData.pageSize;
		this.currentPage = pageData.pageIndex + 1;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
	}
}
