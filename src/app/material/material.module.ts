import { NgModule } from "@angular/core";
import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
} from "@angular/material";

let matImports = [
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
];

@NgModule({
	declarations: [],
	imports: [matImports],
	exports: [matImports],
})
export class MaterialModule {}
