import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { Post } from "./post.model";

const BACKEND_URL = environment.apiURL + "/posts/";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

	constructor(private httpClient: HttpClient, private router: Router) {}

	getPosts(postsPerPage: number, currentPage: number) {
		const queryParams =
			"?pagesize=" + postsPerPage + "&page=" + currentPage;
		this.httpClient
			.get<{ message: string; posts: any; maxPosts: number }>(
				BACKEND_URL + queryParams
			)
			.pipe(
				map(postData => {
					return {
						posts: postData.posts.map(post => {
							return {
								title: post.title,
								content: post.content,
								id: post._id,
								imagePath: post.imagePath,
								creator: post.creator,
							};
						}),
						maxPosts: postData.maxPosts,
					};
				})
			)
			.subscribe(returnedPosts => {
				this.posts = returnedPosts.posts;
				this.returnCopyPosts(returnedPosts.maxPosts);
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
			.post<{ message: string; post: Post }>(BACKEND_URL, postData)
			.subscribe(res => {
				this.router.navigate(["/"]);
			});
	}
	getPost(id: string) {
		return this.httpClient.get<{
			_id: string;
			title: string;
			content: string;
			imagePath: string;
			creator: string;
		}>(BACKEND_URL + id);
	}

	deletePost(id: string) {
		return this.httpClient.delete(BACKEND_URL + id);
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
				creator: null,
			};
		} else {
			postData = new FormData();
			postData.append("title", title);
			postData.append("content", content);
			postData.append("image", image, title);
			postData.append("id", id);
		}

		this.httpClient.put(BACKEND_URL + id, postData).subscribe(res => {
			this.router.navigate(["/"]);
		});
	}

	private returnCopyPosts(postCount: number) {
		let copyPosts: Post[] = [];
		this.posts.forEach(value => {
			copyPosts.push({ ...value });
		});
		this.postsUpdated.next({ posts: copyPosts, postCount });
	}
}
