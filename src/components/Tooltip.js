export default function Tooltip(container)
{
	this._container = container;
	this._div = document.createElement("div");
	this._div.classList.add("map-tip");
	this._div.style.position = "absolute";
	this._div.style.pointerEvents = "none";
	this._div.style.display = "none";
	this._div.setAttribute("role", "tooltip");
	this._container.appendChild(this._div);
}

Tooltip.prototype.hide = function()
{
	this._div.style.display = "none";	
};

Tooltip.prototype.show = function(text, x, y)
{
	
	this._div.innerHTML = text;
	this._div.style.left = parseInt(x)+"px";
	this._div.style.top = parseInt(y)+"px";

	var positions = [
		/* upper-center */
		{"transform":"translate(-50%, -100%)","margin-left":"0px","margin-top":"-24px"},
		/* upper-right */
		{"transform":"translate(0, -100%)","margin-left":"0px","margin-top":"-24px"},
		/* upper-left */
		{"transform":"translate(-100%, -100%)","margin-left":"0px","margin-top":"-24px"},
		/* center-left */
		{"transform":"translate(-100%, -50%)","margin-left":"-24px","margin-top":"0px"},
		/* bottom-left */
		{"transform":"translate(-100%, 0)","margin-left":"0px","margin-top":"24px"},
		/* bottom-center */
		{"transform":"translate(-50%, 0)","margin-left":"0px","margin-top":"24px"},
		/* bottom-right */
		{"transform":"translate(0, 0)","margin-left":"0px","margin-top":"24px"},
		/* center-right */ 
		{"transform":"translate(0, -50%)","margin-left":"24px","margin-top":"0px"}
	];
	
	this._div.style.display = "block";
	
	// move through each of the positions until one doesn't overflow 
	// the container (or until the options run out...)
	
	var i = 0;
	do {
		this._div.style.transform = positions[i].transform;
		this._div.style.marginLeft = positions[i]["margin-left"];
		this._div.style.marginTop = positions[i]["margin-top"];
		i++;
	} while (!isWithin(this._div, this._container) && i < positions.length);
				
	function isWithin(div, container)
	{
		
		var boundaryRight = container.offsetWidth;
		var boundaryLeft = 0;
		var boundaryTop = 0;
		var boundaryBottom = container.offsetHeight;
		
		var left = parseInt(
				div.getBoundingClientRect().left - container.getBoundingClientRect().left
			)+parseInt(div.style.marginLeft);
		var right = left+parseInt(div.offsetWidth);
		var spitze = parseInt(
				div.getBoundingClientRect().top - container.getBoundingClientRect().top
			)+parseInt(div.style.marginTop);
		var bottom = spitze+parseInt(div.offsetHeight);
		
		return right < boundaryRight &&
				left > boundaryLeft && 
				spitze > boundaryTop && 
				bottom < boundaryBottom;
		
	}

};

