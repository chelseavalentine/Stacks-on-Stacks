/*===================================================================
---------------------------------------------------------------------
* INTERACTING WITH STACKOVERFLOW WEBPAGES
-
Grab question data from the Stack Overflow pages that you go to.
---------------------------------------------------------------------
===================================================================*/

/////////////// DATA GRAB
// Save URL, question title, best answer, and best answer's number of upvotes.
var currentURL = window.location.href;
var title = document.getElementById('question-header').children[0].children[0].innerHTML;
var firstAnswer = document.getElementsByClassName('answercell')[0].children[0];
var topUpvotes = document.getElementsByClassName('vote-count-post')[1].textContent;

console.log(firstAnswer);

firstAnswer = firstAnswer.outerHTML;

console.log(firstAnswer);

firstAnswer = formatCodeBlocks(firstAnswer); // format code blocks prior to saving answers

newQuestion(currentURL, title, firstAnswer, topUpvotes); // Try to save a new question


/*-------------------------------------------------------------------
********* SAVE A NEW QUESTION
Add a new question to the user's collection.
-------------------------------------------------------------------*/
function newQuestion(link, question, answer, upvotes) {
	// Clean up the data before we save it
	question = question.replace(/\r?\n/g, '');
	answer = answer.replace(/\r?\n/g, '');

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


/*-------------------------------------------------------------------
********* FORMAT <CODE> BLOCKS
Format the <code> blocks by putting line breaks in logical places
-------------------------------------------------------------------*/
function formatCodeBlocks(originalAnswer) {
	// Create an invisible holder div for us to format in
	// console.log(originalAnswer);
	var invisDiv = document.createElement('div');
	invisDiv.innerHTML = originalAnswer;
	// console.log("before");

	// StackOverflow code block formatting classes
	var com = invisDiv.getElementsByClassName('com'),
		pln = invisDiv.getElementsByClassName('pln'),
		pun = invisDiv.getElementsByClassName('pun');
	var prevIsComment, prevIsBR, prevIsString, prevIsTab, prevIsEmpty, isEmpty, isSmIndent, isLgIndent, br, hasSemicolon, nextIsPLN, nextIsBracket, nextIsComment;

	/////////////// COM blocks
	for (var i = 0; i < com.length; i++) {

		/////////////// IF COMMENT ON LINE BY ITSELF, ADD LINE BREAK BEFORE IT
		// If thing before it is empty.
		br = document.createElement('br');
		br.classList.add('br');

		if (com[i].previousElementSibling !== null ) {
			prevIsEmpty = (com[i].previousElementSibling.textContent === '');
			prevIsTab = (com[i].previousElementSibling.textContent === '  ');
		} else {
			prevIsEmpty = true;
			prevIsTab = false;
		}
		
		if ( prevIsEmpty && !prevIsTab) {
			com[i].previousElementSibling.parentNode.insertBefore(br, com[i]);
		}

		/////////////// IF PLN AFTER COMMENT, ADD BREAK AFTER PLN
		nextIsPLN = false;
		br = document.createElement('br');
		br.classList.add('br');

		if (com[i].nextSibling !== null) {
			nextIsPLN = com[i].nextElementSibling.classList.contains('pln');
		}

		if (nextIsPLN) {
			com[i].parentNode.insertBefore(br, com[i].nextElementSibling);
		}
	}

	/////////////// PUN blocks
	for (var j = 0; j < pun.length; j++) {

		/////////////// IF ;, THEN MAKE A LINE BREAK AFTER IT
		// Unless the next block is a comment, the previous block is a break, or it has text after the ;
		br = document.createElement('br');
		br.classList.add('br');
		hasSemicolon = pun[j].textContent.indexOf(';') > -1;
		
		if (pun[j].nextSibling !== null) {
			if (pun[j].nextSibling.nextSibling !== null) {
				nextIsComment = pun[j].nextElementSibling.nextElementSibling.classList.contains('com');
			} else {
				nextIsComment = false;
			}
		} else {
			nextIsComment = false;
		}

		if (pun[j].previousSibling !== null) {
			prevIsBR = (pun[j].previousElementSibling.classList.contains('br'));
		} else {
			prevIsBR = false;
		}

		if ( hasSemicolon && !nextIsComment && !prevIsBR ) {
			pun[j].parentNode.insertBefore(br, pun[j].nextElementSibling);
		}
	}

	/////////////// PLN blocks
	for (var k = 0; k < pln.length; k++) {

		/////////////// IF EMPTY PLN, ADD LINE BREAK AFTER IT
		// Unless the next is a line break, or the previous block is a break.
		br = document.createElement('br');
		br.classList.add('br');
		isEmpty = (pln[k].textContent === '');

		if (pln[k].nextSibling !== null) {
			nextIsBracket = (pln[k].nextElementSibling.textContent.indexOf('{') > -1);
		} else {
			nextIsBracket = false;
		}
		
		if (pln[k].previousSibling !== null) {
			prevIsBR = (pln[k].previousElementSibling.classList.contains('br'));
		} else {
			prevIsBR = false;
		}

		if ( isEmpty && !prevIsBR && !nextIsBracket ) {
			pln[k].parentNode.insertBefore(br, pln[k].nextElementSibling);
		}

		/////////////// IF TAB, PUT LINE BREAK BEFORE IT
		// Except if the next/prev block is a comment, or the previous block is an break 
		br = document.createElement('br');
		br.classList.add('br');

		isSmIndent = ( pln[k].textContent === '  ' || pln[k].textContent === '   ' );

		if (pln[k].nextSibling !== null) {
			nextIsComment = pln[k].nextElementSibling.classList.contains('com');
		} else {
			nextIsComment = false;
		}

		if (pln[k].previousSibling !== null) {
			prevIsComment = ( pln[k].previousElementSibling.classList.contains('com') );
			prevIsBR = (pln[k].previousElementSibling.classList.contains('br'));
		} else {
			prevIsComment = false;
			prevIsBR = false;
		}

		if ( isSmIndent && !prevIsComment && !prevIsBR && !nextIsComment) {
			pln[k].previousElementSibling.parentNode.insertBefore(br, pln[k]);
		}

		/////////////// IF BLOCK CONTAINS TAB, PUT LINE BREAK BEFORE IT
		// Unless previous block is a break or string
		isLgIndent = ( pln[k].textContent.indexOf('    ') > -1 );

		if (pln[k].nextSibling !== null) {
			nextIsComment = pln[k].nextElementSibling.classList.contains('com');
			isLgIndent = (isLgIndent && !nextIsComment); // We only want it to register this as a large indent if the next block isn't a comment
		}

		br = document.createElement('br');
		br.classList.add('br');
		if (pln[k].previousSibling !== null) {
			prevIsBR = (pln[k].previousSibling.classList.contains('br'));
			prevIsString = ( pln[k].previousElementSibling.classList.contains('str') );
		} else {
			prevIsString = false;
			prevIsBR = false;
		}

		if ( isLgIndent && !prevIsBR && !prevIsString) {
			pln[k].previousElementSibling.parentNode.insertBefore(br, pln[k]);
		}
	}
	return invisDiv.innerHTML;
}
