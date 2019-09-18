import { NgModule } from "@angular/core";
import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
} from "@angular/material";

let matImports = [
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
];

@NgModule({
	declarations: [],
	imports: [matImports],
	exports: [matImports],
})
export class MaterialModule {}
