(function collectData(){
	var currentURL = window.location.href,
		title = document.getElementById('question-header').children[0].children[0].innerHTML,
		firstAnswer = document.getElementsByClassName('answercell')[0].children[0].innerHTML,
		topUpvotes = document.getElementsByClassName('vote-count-post')[1].textContent;

	firstAnswer = formatCodeBlocks(firstAnswer);
	createNewQuestion(currentURL, title, firstAnswer, topUpvotes);
})();


function createNewQuestion(link, question, answer, upvotes) {
	var currentDefaultProject = item.settings.defaultProject,
		isDuplicateQuestion;

	question = removeNewLineCharacters(question);
	answer = removeNewLineCharacters(answer);

	newQuestion = {
		'question': question,
		'link': link,
		'answer': answer,
		'upvotes': upvotes
	};

	isDuplicateQuestion = checkWhetherQuestionExists(newQuestion);

	if (!isDuplicateQuestion) {
		item.projects[currentDefaultProject].questions.push(newQuestion);
		chrome.storage.local.set(item);
	}	
}

function removeNewLineCharacters(string) {
	string.replace(/\r?\n/g, '');
	return string;
}

function checkWhetherQuestionExists(newQuestion) {
	chrome.storage.local.get(null, function(item) {
		var currentDefaultProject = item.settings.defaultProject,
			isDuplicateQuestion = false;

		for (var i = 0; i < item.projects[currentDefaultProject].questions.length; i++) {
			if (item.projects[currentDefaultProject].questions[i].link === newQuestion.link) {
				isDuplicateQuestion = true;
				break;
			}
		}

		
	});

	return isDuplicateQuestion;
}



function formatCodeBlocks(originalAnswer) {
	var formattedAnswer = document.createElement('div');
	formattedAnswer.innerHTML = originalAnswer;

	var comments = formattedAnswer.getElementsByClassName('com'),
		statements = formattedAnswer.getElementsByClassName('pln'),
		whitespaces = formattedAnswer.getElementsByClassName('pun');

	formatCommentBlocks(comments);
	formatCodeStatements(statements);
	formatWhitespaceBlocks(whitespaces);

	return formattedAnswer.innerHTML;
}



function formatCommentBlocks(comments) {
	addLineBeforeStandaloneComments(comments);
	addLineAfterCommentIfCodeNext(comments);
}

function addLineBeforeStandaloneComments(comments) {
	var br, prevIsTab, prevIsEmpty;

	for (var i = 0; i < comments.length; i++) {
		// This occurs when the <span> before it is empty.
		br = document.createElement('br');
		br.classList.add('br');

		if (comments[i].previousElementSibling !== null ) {
			prevIsEmpty = (comments[i].previousElementSibling.textContent === '');
			prevIsTab = (comments[i].previousElementSibling.textContent === '  ');

			if ( prevIsEmpty && !prevIsTab) {
				comments[i].previousElementSibling.parentNode.insertBefore(br, comments[i]);
			}
		} else {
			prevIsEmpty = true;
			prevIsTab = false;
		}
	}
}

function addLineAfterCommentIfCodeNext(comments) {
	var br, nextIsPLN;
	for (var i = 0; i < comments.length; i++) {
		nextIsPLN = false;
		br = document.createElement('br');
		br.classList.add('br');

		if (comments[i].nextSibling !== null) {
			nextIsPLN = comments[i].nextElementSibling.classList.contains('pln');
		}

		if (nextIsPLN) {
			comments[i].parentNode.insertBefore(br, comments[i].nextElementSibling);
		}
	}
}



function formatCodeStatements(statements) {
	addLineAfterSemicolons(statements);
}

function addLineAfterSemicolons(statements) {
	var br, hasSemicolon, nextIsComment, prevIsBR;

	for (var i = 0; i < statements.length; i++) {
		// Unless the next block is a comment, the previous block is a break, or it has text after the ;
		br = document.createElement('br');
		br.classList.add('br');
		hasSemicolon = statements[i].textContent.indexOf(';') > -1;
		
		if (statements[i].nextSibling !== null) {
			if (statements[i].nextSibling.nextSibling !== null) {
				nextIsComment = statements[i].nextElementSibling.nextElementSibling.classList.contains('com');
			} else {
				nextIsComment = false;
			}
		} else {
			nextIsComment = false;
		}

		if (statements[i].previousSibling !== null) {
			prevIsBR = (statements[i].previousElementSibling.classList.contains('br'));
		} else {
			prevIsBR = false;
		}

		if ( hasSemicolon && !nextIsComment && !prevIsBR ) {
			statements[i].parentNode.insertBefore(br, statements[i].nextElementSibling);
		}
	}
}



function formatWhitespaceBlocks(whitespaces) {
	addLineBeforeEmptyBlocks(whitespaces);
	addLineBeforeTabs(whitespaces);
	addLineBeforeTabsWithinBlocks(whitespaces);
}

function addLineBeforeEmptyBlocks(whitespaces) {
	var br, isEmpty, nextIsBracket,prevIsBR;

	for (var i = 0; i < whitespaces.length; i++) {
		// Unless the next is a line break, or the previous block is a break.
		br = document.createElement('br');
		br.classList.add('br');
		isEmpty = (whitespaces[i].textContent === '');

		if (whitespaces[i].nextSibling !== null) {
			nextIsBracket = (whitespaces[i].nextElementSibling.textContent.indexOf('{') > -1);
		} else {
			nextIsBracket = false;
		}
		
		if (whitespaces[i].previousSibling !== null) {
			prevIsBR = (whitespaces[i].previousElementSibling.classList.contains('br'));
		} else {
			prevIsBR = false;
		}

		if ( isEmpty && !prevIsBR && !nextIsBracket ) {
			whitespaces[i].parentNode.insertBefore(br, whitespaces[i].nextElementSibling);
		}
	}
}

function addLineBeforeTabs(whitespaces) {
	var br, isSmIndent, nextIsComment, prevIsComment, prevIsBR;

	for (var i = 0; i < whitespaces.length; i++) {
		// Except if the next/prev block is a comment, or the previous block is an break 
		br = document.createElement('br');
		br.classList.add('br');

		isSmIndent = ( whitespaces[i].textContent === '  ' || whitespaces[i].textContent === '   ' );

		if (whitespaces[i].nextSibling !== null) {
			nextIsComment = whitespaces[i].nextElementSibling.classList.contains('com');
		} else {
			nextIsComment = false;
		}

		if (whitespaces[i].previousSibling !== null) {
			prevIsComment = ( whitespaces[i].previousElementSibling.classList.contains('com') );
			prevIsBR = (whitespaces[i].previousElementSibling.classList.contains('br'));
		} else {
			prevIsComment = false;
			prevIsBR = false;
		}

		if ( isSmIndent && !prevIsComment && !prevIsBR && !nextIsComment) {
			whitespaces[i].previousElementSibling.parentNode.insertBefore(br, whitespaces[i]);
		}
	}
}

function addLineBeforeTabsWithinBlocks(whitespaces) {
	var br, isLgIndent, nextIsComment, prevIsBR, prevIsString;

	for (var i = 0; i < whitespaces.length; i++) {
		// Unless previous block is a break or string
		isLgIndent = ( whitespaces[i].textContent.indexOf('    ') > -1 );

		if (whitespaces[i].nextSibling !== null) {
			nextIsComment = whitespaces[i].nextElementSibling.classList.contains('com');
			isLgIndent = (isLgIndent && !nextIsComment); // We only want it to register this as a large indent if the next block isn't a comment
		}

		br = document.createElement('br');
		br.classList.add('br');
		if (whitespaces[i].previousSibling !== null) {
			prevIsBR = (whitespaces[i].previousSibling.classList.contains('br'));
			prevIsString = ( whitespaces[i].previousElementSibling.classList.contains('str') );
		} else {
			prevIsString = false;
			prevIsBR = false;
		}

		if ( isLgIndent && !prevIsBR && !prevIsString) {
			whitespaces[i].previousElementSibling.parentNode.insertBefore(br, whitespaces[i]);
		}
	}
}
