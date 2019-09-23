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
							imagePath: post.imagePath,
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

	addPost(title: string, content: string, image: File) {
		const postData = new FormData();
		postData.append("title", title);
		postData.append("content", content);
		postData.append("image", image, title);

		this.httpClient
			.post<{ message: string; post: Post }>(
				"http://localhost:3000/api/posts",
				postData
			)
			.subscribe(res => {
				console.log(res);
				const post: Post = {
					id: res.post.id,
					title: res.post.title,
					content: res.post.content,
					imagePath: res.post.imagePath,
				};
				console.log(post);
				this.posts.push(post);
				this.router.navigate(["/"]);
			});
	}
	getPost(id: string) {
		return this.httpClient.get<{
			_id: string;
			title: string;
			content: string;
			imagePath: string;
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

	updatePost(
		id: string,
		title: string,
		content: string,
		image: File | string
	) {
		let postData: Post | FormData;
		if (typeof image === "string") {
			postData = {
				id,
				title,
				content,
				imagePath: image,
			};
		} else {
			postData = new FormData();
			postData.append("title", title);
			postData.append("content", content);
			postData.append("image", image, title);
			postData.append("id", id);
		}

		this.httpClient
			.put("http://localhost:3000/api/posts/" + id, postData)
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
