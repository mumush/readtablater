// index.js
//

//When the newtab page is opened, tell background.js that we want all of the pages the user has saved for later
chrome.runtime.sendMessage({getPagesToDisplay: true}, function(response) {

		addPageImages(response.pagesToDisplay);
});


//Receives an object containg an object per each page in storage
//Page Object Structure: {"full_url": {title: "page_title", screenshotUrl: "src_path_to_screenshot"} }
//Creates an HTML <figure> for each page object
function addPageImages(pagesToDisplay) {

	console.log("Pages to Display: " + JSON.stringify(pagesToDisplay));

	for (var url in pagesToDisplay) {

		console.log(url, pagesToDisplay[url]);

		createUrlFigure(url, pagesToDisplay[url].title, pagesToDisplay[url].screenshotUrl);
	}

}

//Creates a figure tag containing an image, link, button, and figcaption
//	<figure>
//		<button></button>
//		<a><img></a>
//		<figcaption></figcaption>
//	</figure>
function createUrlFigure(url, title, imageUrl) {

	//Create a <figure> tag
	var pagePreviewFigure = document.createElement("figure");
	pagePreviewFigure.className = "pagePreviewFigure"

	//Create a <figcaption> tag
	var pagePreviewFigCaption = document.createElement("figcaption");
	pagePreviewFigCaption.innerHTML = title
	pagePreviewFigCaption.className = "pagePreviewFigCaption"

	//Create an <a> tag
	var pagePreviewLink = document.createElement("a");
	pagePreviewLink.setAttribute("href", url);
	pagePreviewLink.className = "pagePreviewLink"

	//Create an <img> tag
	var pageImageElement = document.createElement("img");
	pageImageElement.setAttribute("src", imageUrl);
	pageImageElement.setAttribute("height", "150");
	pageImageElement.setAttribute("width", "200");
	pageImageElement.setAttribute("alt", title);
	pageImageElement.className = "pagePreviewImage"

	//Insert the img and figcaption elements into the a tag --> <a><img><figcaption></figcaption></a>
	pagePreviewLink.appendChild(pageImageElement);
	pagePreviewLink.appendChild(pagePreviewFigCaption);

	var pagePreviewRemoveBut = document.createElement("button");
	pagePreviewRemoveBut.innerHTML = "&#10005;";
	pagePreviewRemoveBut.className = "pagePreviewRemoveBut";
	pagePreviewRemoveBut.setAttribute("title", "Remove page");
	//add an event listener to react when the button has been clicked
	pagePreviewRemoveBut.addEventListener('click', removePage);


	pagePreviewFigure.appendChild(pagePreviewRemoveBut);

	//Insert the a element into the figure element --> <figure><a></a></figure>
	pagePreviewFigure.appendChild(pagePreviewLink);

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

	//Remove each of the children inside the parent <figure> element
	var firstChildOfFigure = parentFigure.firstChild;

	while(firstChildOfFigure) {

		parentFigure.removeChild(firstChildOfFigure);

		firstChildOfFigure = parentFigure.firstChild;
	}

	//Now remove the parent figure element
	parentFigure.remove();

	//Send a message to background.js letting know that we have visually 
	//removed a page and want to remove the url from the backend array in background.js
	chrome.runtime.sendMessage({removePage: true, urlToRemove: linkUrl}, function(response) {

		console.log("Page Removed: " + response.pageRemoved);

	});

}


