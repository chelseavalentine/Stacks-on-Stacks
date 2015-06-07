/////////////// GLOBAL VARIABLES
var aTag = document.getElementsByTagName('a');
var pTag = document.getElementsByTagName('p');
var questionHolder = document.getElementsByClassName('questions');



function getProjects() {
	chrome.storage.local.get(null, function(items) {
		for (var i = 0; i < items.projects.length; i++) {
			var name =  items.projects[i].name,
				project = createProjectShell(name),
				divHelper = document.getElementById('helpInsertProjects'),
				projects = document.getElementsByClassName('project'),
				lastProject = projects[(projects.length - 1)];

			if (i === 0) {
				divHelper.parentNode.insertBefore(project, divHelper.nextSibling);

				project.addEventListener("load", colorHeaders(), addUnsortedEmpty(i), addStar(i));
			} else {
				lastProject.parentNode.insertBefore(project, lastProject.nextSibling);

				// Execute functions that will [1] change header color, [2] add empty icon, [3] add star icon
				project.addEventListener("load", colorHeaders(),
												    addIcon(i),
												    addStar(i));
			}
		}

		showDefaultProject();
	});
}

function createProjectShell(name) {
	var project = document.createElement('div'),
		header = document.createElement('div'),
		title = document.createElement('p'),
		inputField = document.createElement('input'),
		questions = document.createElement('div');

	project.classList.add('project');

	header.classList.add('projectHeader');
	header.addEventListener('dblclick', function() {
		toggleQuestionsVisibility();
	});

	title.classList.add('projectTitle', 'addIcons');
	inputField.value = name;
	inputField.disabled = true;

	title.appendChild(inputField);
	header.appendChild(title);
	project.appendChild(header);

	questions.classList.add('questions');
	project.appendChild(questions);

	return project;
}

function toggleQuestionsVisibility(header) {
	if (this.nextElementSibling.style.display === 'none') {
		this.nextElementSibling.style.display = "block";
	} else {
		this.nextElementSibling.style.display = "none";
	}
}



/*-------------------------------------------------------------------
********* GET QUESTIONS
Load in the questions for each of our projects.
-------------------------------------------------------------------*/
function getProjectQuestions() {
	chrome.storage.local.get(null, function(items) {
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
