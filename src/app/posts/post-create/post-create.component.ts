import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
	selector: "app-post-create",
	templateUrl: "./post-create.component.html",
	styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
	//editing post variables
	private id: string;
	post: Post;
	paramsSubscription: Subscription;

	//core variables
	loading: boolean = false;
	private editMode: string = "create";

	//form variables
	postForm: FormGroup;
	imagePreview: string;

	constructor(
		private postsService: PostsService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.postForm = new FormGroup({
			title: new FormControl(null, {
				validators: [Validators.required, Validators.minLength(3)],
			}),
			content: new FormControl(null, {
				validators: [Validators.required],
			}),
			image: new FormControl(null, {
				validators: [Validators.required],
				asyncValidators: [mimeType],
			}),
		});

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
							imagePath: post.imagePath,
							creator: post.creator,
						};
						this.postForm.setValue({
							title: this.post.title,
							content: this.post.content,
							image: this.post.imagePath,
						});
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

	onSavePost() {
		this.loading = true;
		if (this.editMode === "creating") {
			this.postsService.addPost(
				this.postForm.value.title,
				this.postForm.value.content,
				this.postForm.value.image
			);
		} else {
			this.postsService.updatePost(
				this.id,
				this.postForm.value.title,
				this.postForm.value.content,
				this.postForm.value.image
			);
		}
		this.postForm.reset();
	}

	onImagedPicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		this.postForm.patchValue({ image: file });
		this.postForm.get("image").updateValueAndValidity();
		const reader = new FileReader();
		reader.onload = () => {
			this.imagePreview = reader.result as string;
		};
		reader.readAsDataURL(file);
	}
}
