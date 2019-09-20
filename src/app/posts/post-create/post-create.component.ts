import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { PostsService } from "../posts.service";
import { Post } from "../post.model";

@Component({
	selector: "app-post-create",
	templateUrl: "./post-create.component.html",
	styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
	private id: string;
	private editMode: string = "create";
	post: Post;
	paramsSubscription: Subscription;
	loading: boolean = false;

	constructor(
		private postsService: PostsService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.paramsSubscription = this.route.paramMap.subscribe(
			(paramMap: ParamMap) => {
				if (paramMap.has("id")) {
					this.id = paramMap.get("id");
					this.editMode = "editing";
					this.loading = true;
					this.postsService.getPost(this.id).subscribe(post => {
						this.loading = false;
						this.post = {
							id: post._id,
							title: post.title,
							content: post.content,
						};
					});
				} else {
					this.editMode = "creating";
					this.id = null;
					this.post = null;
				}
			}
		);
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}

	onSavePost(form: NgForm) {
		this.loading = true;
		if (this.editMode === "creating") {
			this.postsService.addPost(form.value.title, form.value.content);
		} else {
			this.postsService.updatePost(
				this.id,
				form.value.title,
				form.value.content
			);
		}
		form.resetForm();
	}
}
