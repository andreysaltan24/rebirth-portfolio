import "./main2.min.js";
import "./watcher.min.js";
//#region src/components/effects/parallax/parallax.js
var Parallax = class Parallax {
	constructor(elements) {
		if (elements.length) this.elements = Array.from(elements).map((el) => new Parallax.Each(el, this.options));
	}
	destroyEvents() {
		this.elements.forEach((el) => {
			el.destroyEvents();
		});
	}
	setEvents() {
		this.elements.forEach((el) => {
			el.setEvents();
		});
	}
};
Parallax.Each = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll("[data-fls-parallax]");
		this.animation = this.animationFrame.bind(this);
		this.offset = 0;
		this.value = 0;
		this.smooth = parent.dataset.flsParallaxSmooth ? Number(parent.dataset.flsParallaxSmooth) : 15;
		this.setEvents();
	}
	setEvents() {
		this.animationID = window.requestAnimationFrame(this.animation);
	}
	destroyEvents() {
		window.cancelAnimationFrame(this.animationID);
	}
	animationFrame() {
		const topToWindow = this.parent.getBoundingClientRect().top;
		const heightParent = this.parent.offsetHeight;
		const heightWindow = window.innerHeight;
		const positionParent = {
			top: topToWindow - heightWindow,
			bottom: topToWindow + heightParent
		};
		const centerPoint = this.parent.dataset.flsParallaxCenter ? this.parent.dataset.flsParallaxCenter : "center";
		if (positionParent.top < 30 && positionParent.bottom > -30) switch (centerPoint) {
			case "top":
				this.offset = -1 * topToWindow;
				break;
			case "center":
				this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
				break;
			case "bottom":
				this.offset = heightWindow - (topToWindow + heightParent);
				break;
		}
		this.value += (this.offset - this.value) / this.smooth;
		this.animationID = window.requestAnimationFrame(this.animation);
		this.elements.forEach((el) => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : "v",
				direction: el.dataset.flsParallaxDirection ? el.dataset.flsParallaxDirection + "1" : "-1",
				coefficient: el.dataset.flsParallaxCoefficient ? Number(el.dataset.flsParallaxCoefficient) : 5,
				additionalProperties: el.dataset.flsParallaxProperties ? el.dataset.flsParallaxProperties : ""
			};
			this.parameters(el, parameters);
		});
	}
	parameters(el, parameters) {
		if (parameters.axis == "v") el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`;
		else if (parameters.axis == "h") el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
	}
};
if (document.querySelector("[data-fls-parallax-parent]")) new Parallax(document.querySelectorAll("[data-fls-parallax-parent]"));
Parallax.Cursor = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll("[data-fls-parallax-cursor]");
		this.animation = this.animationFrame.bind(this);
		this.targetX = 0;
		this.targetY = 0;
		this.currentX = 0;
		this.currentY = 0;
		this.smooth = parent.dataset.flsParallaxSmooth ? Number(parent.dataset.flsParallaxSmooth) : 15;
		this.setEvents();
	}
	setEvents() {
		this.parent.addEventListener("mousemove", (e) => {
			const rect = this.parent.getBoundingClientRect();
			this.targetX = e.clientX - rect.left - rect.width / 2;
			this.targetY = e.clientY - rect.top - rect.height / 2;
		});
		this.parent.addEventListener("mouseleave", () => {
			this.targetX = 0;
			this.targetY = 0;
		});
		this.animationID = window.requestAnimationFrame(this.animation);
	}
	destroyEvents() {
		window.cancelAnimationFrame(this.animationID);
	}
	animationFrame() {
		this.currentX += (this.targetX - this.currentX) / this.smooth;
		this.currentY += (this.targetY - this.currentY) / this.smooth;
		this.elements.forEach((el) => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : "v",
				direction: el.dataset.flsParallaxDirection ? el.dataset.flsParallaxDirection + "1" : "-1",
				coefficient: el.dataset.flsParallaxCoefficient ? Number(el.dataset.flsParallaxCoefficient) : 5,
				additionalProperties: el.dataset.flsParallaxProperties ? el.dataset.flsParallaxProperties : ""
			};
			if (parameters.axis == "v") el.style.transform = `translate3D(0, ${(parameters.direction * (this.currentY / parameters.coefficient)).toFixed(2)}px, 0) ${parameters.additionalProperties}`;
			else if (parameters.axis == "h") el.style.transform = `translate3D(${(parameters.direction * (this.currentX / parameters.coefficient)).toFixed(2)}px, 0, 0) ${parameters.additionalProperties}`;
			else if (parameters.axis == "both") el.style.transform = `translate3D(${(parameters.direction * (this.currentX / parameters.coefficient)).toFixed(2)}px, ${(parameters.direction * (this.currentY / parameters.coefficient)).toFixed(2)}px, 0) ${parameters.additionalProperties}`;
			else if (parameters.axis == "tilt") {
				const rotateY = (parameters.direction * (-this.currentX / parameters.coefficient)).toFixed(2);
				const rotateX = (parameters.direction * (this.currentY / parameters.coefficient)).toFixed(2);
				el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${parameters.additionalProperties}`;
			}
		});
		this.animationID = window.requestAnimationFrame(this.animation);
	}
};
if (document.querySelector("[data-fls-parallax-cursor-parent]")) document.querySelectorAll("[data-fls-parallax-cursor-parent]").forEach((el) => {
	new Parallax.Cursor(el);
});
//#endregion
