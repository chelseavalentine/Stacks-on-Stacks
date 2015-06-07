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
	header.addEventListener('dblclick', toggleNext);

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

function toggleNext() {
	if (this.nextElementSibling.style.display !== 'none') {
		this.nextElementSibling.style.display = "none";
	} else {
		this.nextElementSibling.style.display = "block";
	}
}



function getProjectQuestions() {
	chrome.storage.local.get(null, function(items) {
		var questionNumber = 0;

		for (var i = 0; i < items.projects.length; i++) {
			for (var j = 0; j < items.projects[i].questions.length; j++, questionNumber++) {
				var question = items.projects[i].questions[j].question,
					link = items.projects[i].questions[j].link,
					answer = items.projects[i].questions[j].answer,
					upvotes = items.projects[i].questions[j].upvotes;

				displayQuestionData(i, j, questionNumber, question, link, answer, upvotes);
			}
		}

		setLinksToTargetBlank();
		deleteEmptyParagraphTags();
	});
}

function setLinksToTargetBlank() {
	var links = document.getElementsByTagName('a');

	for (var i = 0; i < links.length; i++) {
		links[i].target = '_blank';
	}
}

function deleteEmptyParagraphTags() {
	var paragraphs = document.getElementsByTagName('p');

	for (var i = 0; i < paragraphs.length; i++) {
		if (paragraphs[i].innerHTML.replace(/\s|&nbsp;/g, '').length === 0) {
			paragraphs[i].parentNode.removeChild(paragraphs[i]);
		}
	}
}

function createGoToIcon() {
	var goToIcon = document.createElement('img');
	goToIcon.classList.add('icon', 'goToIcon');
	goToIcon.src = 'images/go.svg';

	return goToIcon;
}

function createDeleteIcon() {
	var deleteIcon = document.createElement('img');
	deleteIcon.src = '/images/delete.svg';
	deleteIcon.classList.add('icon', 'deleteIcon');

	return deleteIcon;
}

/*-------------------------------------------------------------------
********* DISPLAY QUESTION DATA
This header is used to denote a function.
-------------------------------------------------------------------*/
function displayQuestionData (i, j, questionNumber, question, link, answer, upvotes) {
	var questions = document.getElementsByClassName('question'),
		questionDivider = document.createElement('div'),
		titleDivider = document.createElement('div'),
		questionParagraph = document.createElement('p'),
		linkToQuestion = document.createElement('a'),
		goToIcon = createGoToIcon(),
		deleteIcon = createDeleteIcon();

	questionDivider.classList.add('question');
	questionDivider.id = 'question' + i + '_' + j;
	questionHolder[i].appendChild(questionDivider); // Add to all questions

	titleDivider.classList.add('title');
	titleDivider.id = 'title' + i + '_' + j;

	questionParagraph.classList.add('questionTitle');
	questionParagraph.innerHTML = question;
	titleDivider.appendChild(questionParagraph);

	linkToQuestion.href = link;
	linkToQuestion.appendChild(goToIcon);
	titleDivider.appendChild(linkToQuestion);

	// When you click on a question, its answer's display will be toggled
	titleDivider.addEventListener("click", toggleNext);

	var destinationQuestion = document.getElementById('question' + i + '_' + j);
	destinationQuestion.appendChild(titleDivider);

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
	center.appendChild(pUpvotes);
	divAnswer.appendChild(center);

	destinationQuestion.appendChild(divAnswer);

	// When you press the 'delete' Icon, the question is removed from the storage and from view
	deleteIcon.addEventListener("click", function() {
		chrome.storage.local.get(null, function(item) {
			var removedVisual = document.getElementById('question' + i + '_' + j);
			removedVisual.parentNode.removeChild(removedVisual);
			deleteLink(JSON.stringify(link), i);
		});
	});

	document.getElementsByClassName('title')[questionNumber].appendChild(deleteIcon);
}
