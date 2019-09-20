import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private httpClient: HttpClient) {}

	getPosts() {
		this.httpClient
			.get<{ message: string; posts: Post[] }>(
				"http://localhost:3000/api/posts"
			)
			.subscribe(postData => {
				this.posts = postData.posts;
				this.returnCopyPosts();
			});
	}
	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string) {
		const post: Post = { title, content };
		this.httpClient
			.post<{ message: string }>("http://localhost:3000/api/posts", post)
			.subscribe(res => {
				console.log(res.message);
				this.posts.push(post);
				this.returnCopyPosts();
			});
	}

	deletePost(index: number) {
		this.posts.splice(index);
		this.returnCopyPosts();
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
