// background.js
//
//

var savedForLaterPages = [];

chrome.browserAction.onClicked.addListener(function(tab) {

	//first check if the tab url has already been saved for later
	var isNewPage = isNewPageToSave(tab.url);

	if (isNewPage) {

		alert("Page is new!");

		chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
			savedForLaterPages.push({"url": tab.url, "title": tab.title, "screenshotData": dataUrl});
		});
	}
	else {

		alert("Page already saved!");
	}


});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.getPagesToDisplay == true) {
      sendResponse({pagesToDisplay: savedForLaterPages});
    }

});



function isNewPageToSave(tabUrl) {

	for (index = 0; index < savedForLaterPages.length; index++) { 

		if( tabUrl === savedForLaterPages[index].url ) {
			return false;
		}

	}

	return true;
}