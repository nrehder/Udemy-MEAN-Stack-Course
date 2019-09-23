import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export function mimeType(
	control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
	if (typeof control.value === "string") {
		return of(null);
	}
	const file = control.value as File;
	const fileReader = new FileReader();
	const frObs = Observable.create(
		(observer: Observer<{ [key: string]: any }>) => {
			fileReader.addEventListener("loadend", () => {
				const arr = new Uint8Array(
					fileReader.result as ArrayBuffer
				).subarray(0, 4);

				let header = "";
				for (let i = 0; i < arr.length; i++) {
					header += arr[i].toString(16);
				}
				switch (header) {
					case "89504e47":
					case "ffd8ffe0":
					case "ffd8ffe0":
					case "ffd8ffe0":
					case "ffd8ffe0":
					case "ffd8ffe0":
						observer.next(null);
						break;
					default:
						observer.next({ invalidFileType: true });
						break;
				}
				observer.complete();
			});
			fileReader.readAsArrayBuffer(file);
		}
	);
	return frObs;
}
