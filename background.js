// background.js
//


//Array holding dictionaries of pages the user wants to read/view later
//Each elements dictionary has the following keys: {"url", "title", "screenshotData"}
var savedForLaterPages = [];

//When the browser action button has been clicked...
chrome.browserAction.onClicked.addListener(function(tab) {

	//First check if the tabs url has already been saved
	var isNewPage = isNewPageToSave(tab.url);

	if (isNewPage) { //Page is new, and should be saved to the array

		//Take a screenshot of the current tab
		chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
			//Add a new dictionary entry to the savedForLaterPages array
			savedForLaterPages.push({"url": tab.url, "title": tab.title, "screenshotData": dataUrl});
		});
	}
	else {

		//alert("Page already saved!");
	}


});

//Listen for messages from index.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	//index.js has requested the array of page dictionaries
    if (request.getPagesToDisplay == true) {

      sendResponse({pagesToDisplay: savedForLaterPages});

    }
    //index.js has requested to remove a page from the savedForLaterPages array
    else if (request.removePage == true) {

    	//Get the url sent with the request and remove it
    	removePage(request.urlToRemove);

    }

});


//Removes the page dictionary from savedForLaterPages that has a url matching the "urlToRemove"
function removePage(urlToRemove) {

	//Get the index of the page that with a url === urlToRemove

	var indexOfUrlInArray;

	for( index = 0; index < savedForLaterPages.length; index++ ) {
		if( savedForLaterPages[index].url === urlToRemove ) {
			indexOfUrlInArray = index;
		}
	}

	alert(savedForLaterPages);

	//Remove the page dictionary at indexOfUrlInArray
	savedForLaterPages.splice(indexOfUrlInArray, 1);

	alert(savedForLaterPages.toString());

	//Alert index.js that the page has been removed from the array
	sendResponse({pageRemoved: true});

}


//Determines if the url passed in has already been saved for later
function isNewPageToSave(tabUrl) {

	for (index = 0; index < savedForLaterPages.length; index++) { 

		if( tabUrl === savedForLaterPages[index].url ) {
			return false;
		}

	}

	return true;
}



