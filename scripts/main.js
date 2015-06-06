// Element references
var starIcons = document.getElementsByClassName('star');
var emptyIcons = document.getElementsByClassName('empty');
var projectsToAddIcons = document.getElementsByClassName('addIcons');


// Element creations
var coverup = document.createElement('div'); // A dark black semi-opaque background that goes behind modal
coverup.classList.add('cover');

function colorHeaders() {
	var bgcolors = ['#00bcd4', '#ff436c', '#8bc34a', '#ff9800'],
		projectHeaders = document.getElementsByClassName('projectHeader');

	for (var i = 0; i < projectHeaders.length; i++) {
		projectHeaders[i].style.background = bgcolors[i%bgcolors.length];
	}
}


function removeHelperText() {
	var helperTexts = document.getElementsByClassName('helperText');

	for (var i = 0; i < helperTexts.length; i++) {
		helperTexts[i].parentNode.removeChild(helperTexts[i]);
	}
}


function colorQuestionWhite() {
	var questionDivs = document.getElementsByClassName('question'),
		questionTitles = document.getElementsByClassName('questionTitle');

	for (var i = 0; i < questionDivs.length; i++) {
		questionDivs[i].style.backgroundColor = 'white';
		questionTitles[i].style.backgroundColor = 'white';
	}
}

function colorQuestionGrey() {
	var questionDivs = document.getElementsByClassName('question'),
		questionTitles = document.getElementsByClassName('questionTitle');

	for (var i = 0; i < questionDivs.length; i++) {
		questionDivs[i].style.backgroundColor = '#fafafa';
		questionTitles[i].style.backgroundColor = '#fafafa';
	}
}


function deleteLink(link, projectIndex) {
	chrome.storage.local.get(null, function(item) {
		for (var i = 0; i < item.projects[projectIndex].questions.length; i++ ) {
			var existingLink = JSON.stringify(item.projects[projectIndex].questions[i].link);

			if (link === existingLink) {
				item.projects[projectIndex].questions.splice(i, 1);
				chrome.storage.local.set(item);
			}
		}
	});
}
