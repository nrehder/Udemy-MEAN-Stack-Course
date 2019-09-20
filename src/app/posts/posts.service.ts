import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private httpClient: HttpClient, private router: Router) {}

	getPosts() {
		this.httpClient
			.get<{ message: string; posts: any }>(
				"http://localhost:3000/api/posts"
			)
			.pipe(
				map(postData => {
					return postData.posts.map(post => {
						return {
							title: post.title,
							content: post.content,
							id: post._id,
						};
					});
				})
			)
			.subscribe(returnedPosts => {
				this.posts = returnedPosts;
				this.returnCopyPosts();
			});
	}
	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string) {
		const post: Post = { title, content, id: null };
		this.httpClient
			.post<{ message: string; id: string }>(
				"http://localhost:3000/api/posts",
				post
			)
			.subscribe(res => {
				post.id = res.id;
				this.posts.push(post);
				this.router.navigate(["/"]);
			});
	}
	getPost(id: string) {
		return this.httpClient.get<{
			_id: string;
			title: string;
			content: string;
		}>("http://localhost:3000/api/posts/" + id);
	}

	deletePost(id: string) {
		this.httpClient
			.delete("http://localhost:3000/api/posts/" + id)
			.subscribe(res => {
				this.posts = this.posts.filter(post => post.id !== id);
				this.returnCopyPosts();
			});
	}

	updatePost(id: string, title: string, content: string) {
		const post: Post = { id, title, content };
		this.httpClient
			.put("http://localhost:3000/api/posts/" + id, post)
			.subscribe(res => {
				this.router.navigate(["/"]);
			});
	}

	private returnCopyPosts() {
		let copyPosts: Post[] = [];
		this.posts.forEach(value => {
			copyPosts.push({ ...value });
		});
		this.postsUpdated.next(copyPosts);
	}
}
