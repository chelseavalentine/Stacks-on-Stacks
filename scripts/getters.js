/////////////// GLOBAL VARIABLES
var aTag = document.getElementsByTagName('a');
var pTag = document.getElementsByTagName('p');
var questionHolder = document.getElementsByClassName('questions');
var divHelper = document.getElementById('helpInsertProjects');

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
			// Iterate through the projects in the storage
			for (var i = 0; i < items.projects.length; i++) {
				var name =  items.projects[i].name;

				/////////////// CREATE A PROJECT
				// Project > (Project header > [Project Name > Input Project] & [Questions])

				// Project
				var divProject = document.createElement('div');
				divProject.classList.add('project');

				// Project header
				var divProjectHeader = document.createElement('div');
				divProjectHeader.classList.add('projectHeader');
				
				// If you double click on the project header, the questions' visibility is toggled
				divProjectHeader.addEventListener("dblclick", function() {
					if (this.nextElementSibling.style.display === 'none') {
						this.nextElementSibling.style.display = "block";
					} else {
						this.nextElementSibling.style.display = "none";
					}
				});

				// Project name
				var pProjectName = document.createElement('p');
				pProjectName.classList.add('projectTitle', 'addIcons');

				// Input project
				var inputProjectName = document.createElement('input');
				inputProjectName.value = name;
				inputProjectName.disabled = true;
				
				// Add input project, project name, & project header to project
				pProjectName.appendChild(inputProjectName);
				divProjectHeader.appendChild(pProjectName);
				divProject.appendChild(divProjectHeader);

				// Questions
				var divQuestions = document.createElement('div');
				divQuestions.classList.add('questions');
				divProject.appendChild(divQuestions);

				/////////////// LOAD IN PROJECTS
				// Load in 'Unsorted' project if index is 0. Else load in other projects.
				if (i === 0) {
					// Insert project after the helper divider
					divHelper.parentNode.insertBefore(divProject, divHelper.nextSibling);

					// Execute functions that will [1] change header color, [2] add empty icon, [3] add star icon
					divProject.addEventListener("load", colorHeaders(), addUnsortedEmpty(i), addStar(i));
				} else {
					// Place the project after the current last project
					var projects = document.getElementsByClassName('project');
					var placing = projects[(projects.length - 1)]; // Get the last project in list of projects

					// Place project after current last project
					placing.parentNode.insertBefore(divProject, placing.nextSibling);

					// Execute functions that will [1] change header color, [2] add empty icon, [3] add star icon
					divProject.addEventListener("load", colorHeaders(), addEmpty(i), addStar(i));
				}
			}

			showDefaultProject(); // visually represent the current place links are added to
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
					var link = items.projects[i].questions[j].link;
					var answer = items.projects[i].questions[j].answer;
					var upvotes = items.projects[i].questions[j].upvotes;

					/////////////// DISPLAY THE DATA TO THE USER
					// Create the dividers to display the data.
					displayQuestionData(i, j, onThisQuestion, question, link, answer, upvotes);
				}
			}

			// Attach event handlers to make visual change when questions are hovered over
			var questionDivs = document.getElementsByClassName('question');
			var questionTitles = document.getElementsByClassName('questionTitle');

			// for (var m = 0; m < questionDivs.length; m++) {
			// 	questionDivs[m].addEventListener('mouseenter', function() {makeWhite();});
			// 	questionDivs[m].addEventListener('mouseleave', function() {notWhite();});
			// 	questionTitles[m].addEventListener('mouseenter', function() {makeWhite();});
			// 	questionTitles[m].addEventListener('mouseleave', function() {notWhite();});
			// }

			// Add open in new tab property to every <a>
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
	/////////////// ADD QUESTION
	// Questions > Question Divider > [Title Divider > Title ] & [Answer]

	// Question divider
	var divQuestion = document.createElement('div');
	divQuestion.classList.add('question');
	divQuestion.id = 'question' + i + '_' + j;
	questionHolder[i].appendChild(divQuestion); // Add to all questions

	// Question title's divider
	var divTitle = document.createElement('div');
	divTitle.classList.add('title');
	divTitle.id = 'title' + i + '_' + j;

	// Question title
	var pQuestionTitle = document.createElement('p');
	pQuestionTitle.classList.add('questionTitle');
	pQuestionTitle.innerHTML = question;
	divTitle.appendChild(pQuestionTitle);

	// 'Goto' icon
	var goToIcon = document.createElement('img');
	goToIcon.classList.add('icon', 'goToIcon');
	goToIcon.src = 'images/go.svg';

	// Link the 'Goto' icon & then add the question link to the Title divider
	var questionLink = document.createElement('a');
	questionLink.href = link;
	questionLink.appendChild(goToIcon);
	divTitle.appendChild(questionLink);

	// When you click on a question, its answer's display will be toggled
	divTitle.addEventListener("click", function() {
		if (this.nextElementSibling.style.display === 'none') {
			this.nextElementSibling.style.display = "block";
		} else {
			this.nextElementSibling.style.display = "none";
		}
	});

	var destinationQuestion = document.getElementById('question' + i + '_' + j);
	destinationQuestion.appendChild(divTitle);

	/////////////// ADD ANSWER
	// Answer divider
	var divAnswer = document.createElement('div');
	divAnswer.classList.add('answer');
	divAnswer.id = 'answer' + i + '_' + j;

	// Create and center the answer
	var center = document.createElement('center');
	var pAnswer = document.createElement('p');
	pAnswer.innerHTML = answer;
	center.appendChild(pAnswer);

	// Style and add upvotes to the answer
	var pUpvotes = document.createElement('p');
	pUpvotes.classList.add('upvotes');
	pUpvotes.innerHTML = upvotes;
	pUpvotes.style.top = 0;
	pUpvotes.style.right = '5px';
	center.appendChild(pUpvotes);
	divAnswer.appendChild(center);

	// Add answer to the question it belongs to
	destinationQuestion.appendChild(divAnswer);

	// Create & add delete icon to question
	var deleteIcon = document.createElement('img');
	deleteIcon.src = '/images/delete.svg';
	deleteIcon.classList.add('icon', 'deleteIcon');

	// When you press the 'delete' Icon, the question is removed from the storage and from view
	deleteIcon.addEventListener("click", function() {
		chrome.storage.local.get(null, function(item) {
			var removedVisual = document.getElementById('question' + i + '_' + j);
			removedVisual.parentNode.removeChild(removedVisual);
			deleteLink(JSON.stringify(link), i);
		});
	});

	document.getElementsByClassName('title')[onThisQuestion].appendChild(deleteIcon);       
}
