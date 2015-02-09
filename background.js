// background.js
//


//When the browser action button has been clicked...
chrome.browserAction.onClicked.addListener(function(tab) {

	//Check if the pages url has already been stored
	checkIfTabIsPinned(tab, getTabData);

});

//Listen for messages from index.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	//index.js has requested all of the pages stored
    if (request.getPagesToDisplay == true) {

    	getPagesFromStore(sendResponse);
    	return true;
    }

    //index.js has requested to remove a page from storage
    else if (request.removePage == true) {

    	//Get the url sent with the request and remove its page from storage
    	removePageFromStore(request.urlToRemove, sendResponse);
    	return true;
    }

});

//Gets all of the pages from local storage
//Sends a response object containing all pages in the store back to index.js 
function getPagesFromStore(getPagesResponseCallback) {

	chrome.storage.local.get(null, function(responsePages) {

		if( Object.getOwnPropertyNames(responsePages).length == 0 ) { //no pages have been saved

			getRandomQuote(getPagesResponseCallback);

		}
		else {

			console.log("Pages Gotten: " + JSON.stringify(responsePages));

			getPagesResponseCallback({pagesToDisplay: responsePages});

		}

	});
}


//Takes a url and removes the key-value entry with a matching url
function removePageFromStore(urlToRemove, removePageResponse) {

	chrome.storage.local.remove(urlToRemove, function(response) {

		console.log("Page removed.");

		removePageResponse({pageRemoved: true});
	});

}

//Attempts to get a page with a matching tab url in storage
//If the response object is empty, the page hasn't been added yet
//Passes the tab and whether the page exists in storage yet to the getTabData() callback
function checkIfTabIsPinned(tab, callback) {

	chrome.storage.local.get(tab.url, function(pageResponse) {

		console.log(Object.getOwnPropertyNames(pageResponse).length);

		if( Object.getOwnPropertyNames(pageResponse).length == 0 ) {
			callback(tab, true);
		}
		else {
			console.log(JSON.stringify(pageResponse));
			callback(tab, false);
		}

	});

}

//Takes a tab and whether or not the associated tab.url is in storage
//If it isn't in storage, it calls addPageToStore() to add it
//Pass in the tabs url, title, and a url to its screenshot
function getTabData(tab, isNew) {

	if (isNew) { //Tab is new, and should be saved

		//Take a screenshot of the current tab
		chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 25}, function(dataUrl) {

			var pageData = {"title": tab.title, "screenshotUrl": dataUrl};

			console.log("key length: " + JSON.stringify(tab.url).length);
			console.log("screenshotUrl length: " + JSON.stringify(dataUrl).length);

			console.log("Page Data: " + JSON.stringify(pageData));

			addPageToStore(tab.url, pageData);
		});

	}
	else {

		alert("You already have this page stored.");
	}

}


//Takes a url with a dictionary of data and creates an object in storage with the following structure
//{"full_url": {title: "page_title", screenshotUrl: "src_path_to_screenshot"} }
function addPageToStore(url, pageData) {

	var pageObject = {};
	pageObject[url] = pageData;

	chrome.storage.local.set(pageObject, function() {
		// Notify that we saved.
		console.log("Page Added!");
	});
}


function getRandomQuote(callback) {

	var url = "http://quotesondesign.com/api/3.0/api-3.0.json";

	var xmlhttp;
	// compatible with IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200){

			callback({quoteToDisplay: xmlhttp.responseText});

		}
	}

	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}


