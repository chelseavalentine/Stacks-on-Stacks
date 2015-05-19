var aTag = document.getElementsByTagName('a');
var pTag = document.getElementsByTagName('p');
var questionHolder = document.getElementsByClassName('questions');
var divHelper = document.getElementById('helpInsertProjects');

var com = document.getElementsByClassName('com'); // Stack overflow code format class
var pln = document.getElementsByClassName('pln'); // Stack overflow code format class
var pun = document.getElementsByClassName('pun'); // Stack overflow code format class


/*===================================================================
---------------------------------------------------------------------
* GET FROM THE STORAGE
-
This checks whether individual data tables exist, and if they don't,
it will create the data table for you. 
---------------------------------------------------------------------
===================================================================*/

/*-------------------------------------------------------------------
********* GET PROJECTS
Load in each of our projects. This will give us the dividers that
our questions will get appended to.
-------------------------------------------------------------------*/
function getProjects() {
	return chrome.storage.local.get(null, function(items) {
		if (!chrome.runtime.error) {
			// We want the appended stars to be unfilled
			var filled = false;

			// Iterate through the projects in the storage
			for (var i = 0; i < items.projects.length; i++) {
				var name =  items.projects[i].name;

				// Create what a project looks like
				var divProject = document.createElement('div');
				divProject.classList.add('project');

				var divProjectHeader = document.createElement('div');
				divProjectHeader.classList.add('projectHeader');

				var pProjectName = document.createElement('p');
				pProjectName.classList.add('projectTitle', 'addIcons');

				var inputProjectName = document.createElement('input');
				inputProjectName.value = name;
				inputProjectName.disabled = true;
				pProjectName.appendChild(inputProjectName);
				divProjectHeader.appendChild(pProjectName);
				divProject.appendChild(divProjectHeader);

				var divQuestions = document.createElement('div');
				divQuestions.classList.add('questions');
				divProject.appendChild(divQuestions);

				var divAnswers = document.createElement('div');
				divAnswers.classList.add('answers');
				divProject.appendChild(divAnswers);

				// If it's the first project being loaded, then it is the 'Unsorted' project, and we want that to be first.
				if (i === 0) {
					// Insert project after the helper divider
					divHelper.parentNode.insertBefore(divProject, divHelper.nextSibling);

					// Execute functions that will fill the project up
					divProject.addEventListener("load", colorHeaders(), addUnsortedEmpty(i), addStar(i));
				} else {
					// Load all of the projects that aren't 'Unsorted' in a slightly different manner

					// Place the project after the current last project
					var projects = document.getElementsByClassName('project');
					var placing = projects[(projects.length - 1)]; // Place it last in the list of projects

					// Insert project after the placing
					placing.parentNode.insertBefore(divProject, placing.nextSibling);
					divProject.addEventListener("load", colorHeaders(), addEmpty(i), addStar(i));
				}
			}

			showDefaultProject(); // visually represent the current place links are added to

			// When you double click on a project header, it will hide the questions
			$(".projectHeader").dblclick(function() {
				 $(this).next().toggle(0);
				});
			// THIS DON'T WORK FOR SOME REASON for (var k = 0; k < questionHolder.length; k++) {
			// 	var thisquestion = questionHolder[k];
			// 	console.log(questionHolder[k].style.display);
			// 	projectHeaders[k].addEventListener("dblclick", function() {
			// 		// If the questions are shown, hide them
			// 		if (thisquestion.style.display !== 'none') {
			// 			questionHolder[k].style.display = 'none';
			// 		} else {
			// 			// Otherwise, the questions are hidden. Show them.
			// 			questionHolder[k].style.display = '';
			// 		}
			// 	})
			// }
		}
	});
}

/*-------------------------------------------------------------------
********* GET QUESTIONS
Load in the questions for each of our projects.
-------------------------------------------------------------------*/
function getAllLinks() {
	return chrome.storage.local.get(null, function(items) {
		if(!chrome.runtime.error) {
			// Keep track of the total number of questions
			var onThisQuestion = 0;

			// Iterate through the projects
			for (var i = 0; i < items.projects.length; i++) {

				// Iterate through the questions
				for (var j = 0; j < items.projects[i].questions.length; j++, onThisQuestion++) {

					/////////////// DATA INPUT PREPARATION
					// Prepare the data that we'll display to the user.
					var question = items.projects[i].questions[j].question;
					var link = JSON.stringify(items.projects[i].questions[j].link);
					var answer = items.projects[i].questions[j].answer;
					var upvotes = items.projects[i].questions[j].upvotes;

					/////////////// DISPLAY THE DATA TO THE USER
					// Create the dividers to display the data.
					displayQuestionData(i, j, onThisQuestion, question, link, answer, upvotes);
				}
			}

			//Add open in new tab property to every <a>
			// aTag.target = "_blank";
			for (var k = 0; k < aTag.length; k++ ) {
				aTag[k].target = '_blank';
			}
			
			//get rid of empty <p> tags
			for (var l = 0; l < pTag.length; l++) {
				if (pTag[l].innerHTML.replace(/\s|&nbsp;/g, '').length === 0) {
					pTag[l].parentNode.removeChild(pTag[l]);
				}
			}
		}
	});
}


/*-------------------------------------------------------------------
********* DISPLAY QUESTION DATA
This header is used to denote a function.
-------------------------------------------------------------------*/
function displayQuestionData (i, j, onThisQuestion, question, link, answer, upvotes) {
	// Create & add the question divider
	var divQuestion = document.createElement('div');
	divQuestion.classList.add('question');
	divQuestion.id = 'question' + i + '_' + j;

	questionHolder[i].appendChild(divQuestion);

	// Fill in the question divider
	var divTitle = document.createElement('div');
	divTitle.classList.add('title');
	divTitle.id = 'title' + i + '_' + j;

	var pQuestionTitle = document.createElement('p');
	pQuestionTitle.classList.add('questionTitle');
	pQuestionTitle.innerHTML = question;
	divTitle.appendChild(pQuestionTitle);

	var goToIcon = document.createElement('img');
	goToIcon.classList.add('icon', 'goToIcon');
	goToIcon.src = 'images/go.svg';

	var questionLink = document.createElement('a');
	questionLink.target = '_blank';
	questionLink.href = link;
	questionLink.appendChild(goToIcon);
	divTitle.appendChild(questionLink);

	divTitle.addEventListener("click", function() {
		$(this).next().toggle(0);
	});

	var destinationQuestion = document.getElementById('question' + i + '_' + j);
	destinationQuestion.appendChild(divTitle);

	// Create & fill in the answer divider before adding it after the question
	var divAnswer = document.createElement('div');
	divAnswer.classList.add('answer');
	divAnswer.id = 'answer' + i + '_' + j;

	var center = document.createElement('center');

	var pAnswer = document.createElement('p');
	pAnswer.innerHTML = answer;
	center.appendChild(pAnswer);

	var pUpvotes = document.createElement('p');
	pUpvotes.classList.add('upvotes');
	pUpvotes.innerHTML = upvotes;
	center.appendChild(pUpvotes);
	divAnswer.appendChild(center);

	var answerDestination = document.getElementById('question' + i + '_' + j);
	answerDestination.appendChild(divAnswer);

	var upvote = document.getElementsByClassName('upvotes')[onThisQuestion];
	upvote.style.top = 0;
	upvote.style.right = '5px';

	// Create & add delete icon to question
	var deleteIcon = document.createElement('img');
	deleteIcon.src = '/images/delete.svg';
	deleteIcon.classList.add('icon', 'deleteIcon');

	deleteIcon.addEventListener("click", function() {
		var deleteTest;
		chrome.storage.local.get(null, function(item) {
			var removedVisual = document.getElementById('question' + i + '_' + j);
			removedVisual.parentNode.removeChild(removedVisual);
			deleteLink(link, i);
		});
	});

	document.getElementsByClassName('title')[onThisQuestion].appendChild(deleteIcon);       
	}


/*-------------------------------------------------------------------
********* FORMAT <CODE> BLOCKS
This header is used to denote a function.
-------------------------------------------------------------------*/
function formatCodeBlocks() {
	// Need to include this code snippet, otherwise it'll also edit Stack Overflow's <span>'s (Should probably put in logic for metaexchange later too)
	var currentURL = window.location.href.toString().indexOf("stackoverflow") >= 0;
	var br = document.createElement('br');

	// Can't figure out how to rewrite this in pure JS
	if (!(currentURL)) {
		// If there is a comment on a line by itself, then add a line break before it to show this
		for (var i = 0; i < com.length; i++) {
			if ( ($(".com").eq(i).prev().html() === "") ) {
				$("<br>").insertBefore($(".com").eq(i));
			}
			if ( ($(".com").eq(i).prev().html() === "  ") ) {
				$("<br>").insertBefore($(".com").eq(i));
			}
		}

		for (var j = 0; j < pun.length; j++) {
			// If ; then make a line break after it
			if ( ($(".pun").eq(j).html().indexOf(";") > -1) && !($(".pun").eq(j).next().next().hasClass("com")) && !($(".pun").eq(j).prev().is("br")) ) {
				$("<br>").insertAfter($(".pun").eq(j));
			}
		}

		for (var k = 0; k < pln.length; k++) {
			// If there's an empty pln, add another line break
			if ( ($(".pln").eq(k).html() === "") && !($(".pln").eq(k).prev().is("br")) ) {
				$("<br>").insertAfter($(".pln").eq(k));
			}

			// Put a line break before 'tab's, because that's usually indicates a new line
			if ( ($(".pln").eq(k).html() === "  ") && !($(".pln").eq(k).prev().hasClass("com")) ) {
				$("<br>").insertBefore($(".pln").eq(k));
			}

			// Check whether the span contains a tab; if it does, put a line break before it
			if (($(".pln").eq(k).html().indexOf("    ") > -1) && !($(".pln").eq(k).prev().is("br")) ) {
				$("<br>").insertBefore($(".pln").eq(k));
			}
		}
	}
};
setTimeout(formatCodeBlocks, 500);