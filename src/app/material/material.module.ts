import { NgModule } from "@angular/core";
import {
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatDialogModule,
} from "@angular/material";

let matImports = [
	MatInputModule,
	MatCardModule,
	MatButtonModule,
	MatToolbarModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatDialogModule,
];

@NgModule({
	declarations: [],
	imports: [matImports],
	exports: [matImports],
})
export class MaterialModule {}
