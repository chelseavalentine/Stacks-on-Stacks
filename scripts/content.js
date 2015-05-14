// GET CURRENT URL
var currentURL = window.location.href;
var title = document.getElementById('question-header').children[0].children[0].innerHTML;
var firstAnswer = document.getElementsByClassName('answercell')[0].children[0].innerHTML;
var topUpvotes = document.getElementsByClassName('vote-count-post')[1].textContent;

var content = firstAnswer.split('share|improve this answer');
firstAnswer = content[0];

saveLink(currentURL, title, firstAnswer, topUpvotes);


function saveLink(link, question, answer, upvotes) {
	// prettify question & answer by taking out whitespaces, tabs, and null
	question = question.split(/\s+/).filter(function(e){return e===0 || e}).join(' ');
	answer = answer.replace(/\r?\n/g, '').substring(0, answer.length);

	// check for duplicates
	obj = {
		'question': question,
		'link': link,
		'answer': answer,
		'upvotes': upvotes
	};

	chrome.storage.local.get(null, function(item) {
		var currentProject = item.settings['defaultProject'];
		console.log("Current project we're adding into is " + currentProject);

		var isDup = false;
		for (var i = 0; i < item.projects[currentProject].questions.length; i++) {
			if (item.projects[currentProject].questions[i]['link'] === obj['link']) {
				isDup = true;
				break;
			}
		}

		if (!isDup) {
			item['projects'][currentProject]['questions'].push(obj);
			chrome.storage.local.set(item, function(){
				console.log("We just added a question to " + currentProject);
			});
		} else {
			console.log("You've already visited this page.");
		}
	});
}
