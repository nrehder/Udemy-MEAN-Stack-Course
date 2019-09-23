import { NgModule } from "@angular/core";
import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
} from "@angular/material";

let matImports = [
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
];

@NgModule({
	declarations: [],
	imports: [matImports],
	exports: [matImports],
})
export class MaterialModule {}
