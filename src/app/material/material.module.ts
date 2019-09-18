import { NgModule } from "@angular/core";
import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
} from "@angular/material";

let matImports = [
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
];

@NgModule({
	declarations: [],
	imports: [matImports],
	exports: [matImports],
})
export class MaterialModule {}
