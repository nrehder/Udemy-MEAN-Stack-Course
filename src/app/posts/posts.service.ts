import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	getPosts() {
		let returnPosts: Post[] = [];
		for (let i = 0; i < this.posts.length; i++) {
			returnPosts.push({ ...this.posts[i] });
		}
		return returnPosts;
	}
	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string) {
		this.posts.push({ title, content });
		this.postsUpdated.next(this.getPosts());
	}
}
