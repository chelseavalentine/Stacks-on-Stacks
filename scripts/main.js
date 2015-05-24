// INITIALIZE GLOBAL VARIABLES
// Project background colors
var bgcolors = ['#00bcd4', '#ff436c', '#8bc34a', '#ff9800'];
var projectHeaders = document.getElementsByClassName('projectHeader');

// Element references
var starIcons = document.getElementsByClassName('star');
var emptyIcons = document.getElementsByClassName('empty');
var projectsToAddIcons = document.getElementsByClassName('addIcons');
var helperTexts = document.getElementsByClassName('helperText');

// Element creations
var coverup = document.createElement('div'); // A dark black semi-opaque background that goes behind modal
coverup.classList.add('cover');

/*===================================================================
---------------------------------------------------------------------
* VISUALS CHANGES
---------------------------------------------------------------------
===================================================================*/

/*-------------------------------------------------------------------
********* COLOR PROJECT HEADERS
-------------------------------------------------------------------*/
function colorHeaders() {
	for (var i = 0; i < projectHeaders.length; i++) {
		projectHeaders[i].style.background = bgcolors[i%bgcolors.length];
	}
}

/*-------------------------------------------------------------------
********* REMOVE ALL HELPER TEXT
-------------------------------------------------------------------*/
function removeHelperText() {
	for (var i = 0; i < helperTexts.length; i++) {
		helperTexts[i].parentNode.removeChild(helperTexts[i]);
	}
}

/*===================================================================
---------------------------------------------------------------------
* MANIPULATING DATA
-
Functions that deal with editing, deleting data, etc.
---------------------------------------------------------------------
===================================================================*/

/*-------------------------------------------------------------------
********* DELETE A LINK
Search the storage for a link that matches the one that is passed in,
and delete the match.
-------------------------------------------------------------------*/
function deleteLink(link, projectPos) {
	var found = false;

	chrome.storage.local.get(null, function(item) {
		//Search through all of the links in the desired project
		for (var i = 0; i < item.projects[projectPos].questions.length; i++ ) {
			if (link === JSON.stringify(item.projects[projectPos].questions[i].link)) {
				// found object to delete from storage
				item.projects[projectPos].questions.splice(i, 1);
				found = true;
				break;
			}
		}
	
		if (found) {
			chrome.storage.local.set(item);
		}
	});
}
