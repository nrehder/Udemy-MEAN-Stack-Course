import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private httpClient: HttpClient) {}

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
		const post: Post = { title, content };
		this.httpClient
			.post<{ message: string; id: string }>(
				"http://localhost:3000/api/posts",
				post
			)
			.subscribe(res => {
				post.id = res.id;
				this.posts.push(post);
				this.returnCopyPosts();
			});
	}

	deletePost(id: string) {
		this.httpClient
			.delete("http://localhost:3000/api/posts/" + id)
			.subscribe(res => {
				this.posts = this.posts.filter(post => post.id !== id);
				this.returnCopyPosts();
			});
	}

	editPost(index: number, title: string, content: string) {
		this.posts[index] = { title, content };
	}

	private returnCopyPosts() {
		let copyPosts: Post[] = [];
		this.posts.forEach(value => {
			copyPosts.push({ ...value });
		});
		this.postsUpdated.next(copyPosts);
	}
}
