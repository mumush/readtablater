// index.js
//

//When the newtab page is first opened, tell background.js that we want all of the urls the user has saved for later
chrome.runtime.sendMessage({getPagesToDisplay: true}, function(response) {

		addPageImages(response.pagesToDisplay);
});


//Receives an array of pages
//Each element of the array contains a dictionary with the following keys: {"url", "title", "screenshotData"}
//Creates an HTML <figure> for each page in the array
function addPageImages(pagesToDisplay) {

	for (index = 0; index < pagesToDisplay.length; index++) { 
		
		//alert("Index: " + index + "~ Title: " + pagesToDisplay[index].title);
		//alert("Screenshot Data: " + pagesToDisplay[index].screenshotData);
		createUrlFigure(pagesToDisplay[index]);
	}

}

//Creates a figure tag containing an image, link, button, and figcaption
//	<figure>
//		<button></button>
//		<a><img></a>
//		<figcaption></figcaption>
//	</figure>
function createUrlFigure(page) {

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
	
	var pagePreviewRemoveBut = document.createElement("button");
	pagePreviewRemoveBut.innerHTML = "&#10005;";
	pagePreviewRemoveBut.className = "pagePreviewRemoveBut";
	pagePreviewRemoveBut.setAttribute("title", "Remove page");
	//add an event listener to react when the button has been clicked
	pagePreviewRemoveBut.addEventListener('click', removePage);

	pagePreviewFigure.appendChild(pagePreviewRemoveBut);

	pagePreviewFigure.appendChild(pagePreviewLink);
	pagePreviewFigure.appendChild(pagePreviewFigCaption)

	//Finally insert the figure element into the "pagesForLater" div
	document.getElementById("pagesForLater").appendChild(pagePreviewFigure);

}


//Called when a "remove" button has been clicked
function removePage(event) {

	var clickedRemoveBut = event.currentTarget
	//get the clicked buttons parent, the parent figure element
	var parentFigure = clickedRemoveBut.parentNode;

	//grab the href of the child <a> tag inside the figure element
	//passed along in message to background.js
	var link = parentFigure.getElementsByClassName("pagePreviewLink")[0];
	var linkUrl = link.getAttribute("href");
	alert("URL to Remove: " + linkUrl);

	//Remove each of the children inside the parent <figure> element
	var firstChildOfFigure = parentFigure.firstChild;

	while(firstChildOfFigure) {

		parentFigure.removeChild(firstChildOfFigure);

		firstChildOfFigure = parentFigure.firstChild;
	}

	//Now remove the parent figure element
	parentFigure.remove();

	//Send a message to background.js letting know that we have removed a page
	//and want to remove the url from the backend array in background.js
	chrome.runtime.sendMessage({removePage: true, urlToRemove: linkUrl}, function(response) {

		alert("Page Removed: " + response.pageRemoved);
	});

}


