import { BrowserWindow } from "electron";

let window; // Prevent window from being garbage collected

export function getWindow() {
	return window;
}

export function setWindow(w) {
	window = w;
}