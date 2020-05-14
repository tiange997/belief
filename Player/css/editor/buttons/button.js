var button;
var container;

var isWSizable = function () {
	return true;
};
var isHSizable = function () {
	return true;
};

var load = function (text) {
	button = document.getElementById('button');
	container = document.getElementById("container");
	setText(text);
};

var center = function () {
	container.style.left = ((window.innerWidth - getWidth()) / 2) + 'px';
	container.style.top = ((window.innerHeight - getHeight()) / 2) + 'px';
};

var getWidth = function () {
	return getStyle("width") + getStyle("paddingLeft") + getStyle("paddingRight");
};

var setWidth = function (width) {
	button.style.width = width;
};

var getHeight = function () {
	return getStyle("height") + getStyle("paddingTop") + getStyle("paddingBottom");
};

var setHeight = function (height) {
	button.style.height = height || "100%";
};

var setText = function (text) {
	button.innerText = text;
};

var getStyle = function (style) {
	return parseInt(window.getComputedStyle(button)[style], 10);
};