/*===================================================================
---------------------------------------------------------------------
* INTERACTING WITH WEBPAGES
-
Grab question data from the Stack Overflow pages that you go to.
---------------------------------------------------------------------
===================================================================*/

/////////////// DATA GRAB
// Attempt to save the URL, Question title, Best answer, and Best Answer's number of upvotes.
var currentURL = window.location.href;
var title = document.getElementById('question-header').children[0].children[0].innerHTML;
var firstAnswer = document.getElementsByClassName('answercell')[0].children[0].innerHTML;
var topUpvotes = document.getElementsByClassName('vote-count-post')[1].textContent;

newQuestion(currentURL, title, firstAnswer, topUpvotes);

/*-------------------------------------------------------------------
********* SAVE A NEW QUESTION
Add a new question to the user's collection.
-------------------------------------------------------------------*/
function newQuestion(link, question, answer, upvotes) {
	// Clean up the data before we save it
	question = question.replace(/\r?\n/g, '');
	answer = answer.replace(/\r?\n/g, '');
	console.log("Checkpoint 2");
	console.log(firstAnswer);


	// Format the answer before we save it

	// Create the object that we will push to the collection, granted that it doesn't already exist.
	obj = {
		'question': question,
		'link': link,
		'answer': answer,
		'upvotes': upvotes
	};

	chrome.storage.local.get(null, function(item) {
		var currentProject = item.settings.defaultProject; // Get user's current default project to add links to

		// check for duplicates
		var isDup = false;
		for (var i = 0; i < item.projects[currentProject].questions.length; i++) {
			if (item.projects[currentProject].questions[i].link === obj.link) {
				isDup = true;
				break;
			}
		}

		if (!isDup) {
			item.projects[currentProject].questions.push(obj);
			chrome.storage.local.set(item);
		}
	});
}
