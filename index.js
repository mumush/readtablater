// index.js
//

chrome.runtime.sendMessage({getPagesToDisplay: true}, function(response) {

		//alert(response.pagesToDisplay.length);

		addPageImages(response.pagesToDisplay);

});


function addPageImages(pagesToDisplay) {

	for (index = 0; index < pagesToDisplay.length; index++) { 
		
		//alert("Index: " + index + "~ Title: " + pagesToDisplay[index].title);
		//alert("Screenshot Data: " + pagesToDisplay[index].screenshotData);
		createUrlImageLink(pagesToDisplay[index]);

	}

}

//creates an img tag
function createUrlImageLink(page) {

	//Create a <figure> tag
	var pagePreviewFigure = document.createElement("figure");
	pagePreviewFigure.className = "pagePreviewFigure"

	//Create a <figcaption> tag
	var pagePreviewFigCaption = document.createElement("figcaption");
	pagePreviewFigCaption.innerHTML = page.title
	pagePreviewFigCaption.className = "pagePreviewFigCaption"

	//Create an <a> tag
	var pagePreviewLink = document.createElement("a");
	pagePreviewLink.setAttribute("href", page.url);
	pagePreviewLink.className = "pagePreviewLink"

	//Create an <img> tag
	var pageImageElement = document.createElement("img");
	pageImageElement.setAttribute("src", page.screenshotData);
	pageImageElement.setAttribute("height", "150");
	pageImageElement.setAttribute("width", "200");
	pageImageElement.setAttribute("alt", page.title);
	pageImageElement.className = "pagePreviewImage"

	//Insert the img element into the a tag --> <a><img></a>
	pagePreviewLink.appendChild(pageImageElement);

	//Insert the a and figcaption elements into the figure element --> <figure><a></a><figcaption></figcaption></figure>
	pagePreviewFigure.appendChild(pagePreviewLink);
	pagePreviewFigure.appendChild(pagePreviewFigCaption)

	//Finally insert the figure element into the "pagesForLater" div
	document.getElementById("pagesForLater").appendChild(pagePreviewFigure);

}
