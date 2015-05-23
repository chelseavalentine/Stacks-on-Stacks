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
* VISUAL MANIPULATION
-
All of the functions that deal with changes of images, colors, etc.
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


/*===================================================================
***** MANIPULATING DATA: PERMANENT CHANGES
Permanent changes, such as deleting a question/project.
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


/*===================================================================
***** MANIPULATING DATA: REORGANIZATION
Reorganization changes, such as moving around links, & reordering
projects.
===================================================================*/

/*-------------------------------------------------------------------
********* EDITTING PROJECT HEADERS
Edit a project's title
-------------------------------------------------------------------*/
// This will hold our current question IDs in their order
var questions = [];
var editButton = document.getElementById('edit');
var saveEditsButton = document.getElementById('saveEdits');


$("#edit")
	.click(function() {
		// Switch button shown from edit --> save button
		editButton.style.display = 'none';
		saveEditsButton.style.display = 'block';
		saveEditsButton.style.left = '160px';

		// Make all of the project headers, except for 'Unsorted' editable
		for (var i = 1; i < $("input").length; i++) {
			document.getElementsByTagName("input")[i].disabled = false;
			$("input").eq(i).on('keyup', function(e) {
				if (e.which == 13) {
					$("#saveEdits").click();
					this.disabled = true;
				}
			});
		}
		
		$(".questionTitle, .title")
			.unbind("click")
			// Change the questions so you get a different cursor when you hover
			.css({
				"cursor": "move"
			})
			// make questions draggable
			.attr("draggable", "true");
		
		$(".questions").sortable({
			connectWith: '.questions'
		});
		// Make it so that double clicking on a header title won't hide all questions
		$(".project").unbind("dblclick");

		// Remove the current 'go to' & 'delete' buttons
		$(".deleteIcon, .goToIcon").remove();

		// Save a list of the questions' ID values so we know their ordering
		questions = []; // reset the array of ID values
		var questionNum = 0 ; // init

		for (var i = 0; i < $(".questions").length; i++) {
			questions.push([]);
			for (var j = 0; j < $(".questions").eq(i).children().length; j++, questionNum++) {
				$(".question").eq(questionNum).attr('id', i + "," + j); // to make it easier, let's just assign it an integer
				questions[i].push([i, j]);
			}
		}
	});

// var saveEditsButton = document.getElementById('saveEdits');
// saveEditsButton.click(function() {
// 	saveEdits();
// });

$("#saveEdits").click(function() {
	saveEdits();
});

function saveEdits() {
	// Show the edit button again & hide show button
	$("#edit").show(0);
	$("#saveEdits").hide(0);

	// Get the changed order of the questions
	var newOrder = []; // reset the array of ID values
	var questionNum = 0; // init
	for (var i = 0; i < $(".questions").length; i++) {
		newOrder.push([]);
		for (var j = 0; j < $(".questions").eq(i).children().length; j++, questionNum++) {
			var newQuestionIndex = $(".question").eq(questionNum).attr('id'); // to make it easier, let's just assign it an integer
			newOrder[i].push(newQuestionIndex);
		}
	}

	var newQuestions = [],
		dimensions,
		firstNum,
		secondNum;

	chrome.storage.local.get(null, function(item) {
		// Save each of the project headers
		for (var i = 1; i < $("input").length; i++) {
			item.projects[i].name = $("input").eq(i).val();
		}

		for (var i = 0; i < newOrder.length; i++) {
			newQuestions.push([]);

			for (var j = 0; j < newOrder[i].length; j++) {
				dimensions = newOrder[i][j].split(',');

				//get first number & last number
				firstNum = parseInt(dimensions[0]);
				secondNum = parseInt(dimensions[1]);

				var addObject = item.projects[firstNum].questions[secondNum];
				newQuestions[i].push(addObject);
			}
		}

		for (var i = 0; i < item.projects.length; i++) {
			item.projects[i].questions = newQuestions[i];
		}
		
		// Set the reordered projects...
		chrome.storage.local.set(item, function() {
			console.log("Your function names have successfully been changed.");
		});
	});

	$("input").disabled = true;
	// window.location.href = window.location.href; // refresh
}

// window.onbeforeunload = function() {
// 	saveEdits();
// }

$(window).unload(function() {
	saveEdits();
});
