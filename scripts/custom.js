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

/*===================================================================
***** SHOW NEW DEFAULT CHOICE
When projects are loaded in, show the project which is the default
project that links are added into by replacing its star with a star
that doesn't change to an unfilled star when hovered over.
===================================================================*/

/*-------------------------------------------------------------------
********* SHOW NEW DEFAULT CHOICE [MAIN]
-------------------------------------------------------------------*/
function showDefaultProject() {
	chrome.storage.local.get(null, function(item) {
		// get index of current default project
		var currentDefault = item.settings.defaultProject;

		// remove the current star of the current project
		starIcons[currentDefault].parentNode.removeChild(starIcons[currentDefault]);

		/////////////// REPLACE IT WITH A FUNCTIONLESS STAR
		// create the functionless star to be added to the body
		var chosenStar = document.createElement('img');
		chosenStar.src = 'images/star-chosen.svg';
		chosenStar.classList.add('star');

		// Add star to the body
		projectsToAddIcons[currentDefault].appendChild(chosenStar);

		// Set activities that'll occur upon user hover
		chosenStar.addEventListener('mouseenter', function() {hoverChosenStar(currentDefault);}, false);
		chosenStar.addEventListener('mouseout', function() {removeHelperText();}, false);
	});
}

/*-------------------------------------------------------------------
********* SHOW NEW DEFAULT CHOICE: Upon hovering over star
Display helper text to indicate the action that'll occur upon click
-------------------------------------------------------------------*/
function hoverChosenStar(currentDefault) {
	// Initialize variables
	var unsortedEmptyIcon = document.getElementById("emptyUnsorted");
	var top = starIcons[currentDefault].getBoundingClientRect().top; // get the star's offset from the top
	var left = starIcons[currentDefault].getBoundingClientRect().left; // get the star's offset from the left

	var height = projectHeaders[currentDefault].offsetHeight;
	var topOffset = unsortedEmptyIcon.getBoundingClientRect().top; // get the Unsorted empty icon's offset from the top

	// Create and style helper text, before adding it to the page
	var helperText = document.createElement('p');
	helperText.textContent = "This is the default project";
	helperText.classList.add('helperText');
	helperText.style.top = top - topOffset + height + 18 + "px";
	helperText.style.left = left - 16 + "px";
	document.body.appendChild(helperText);
}

/*-------------------------------------------------------------------
********* SHOW NEW DEFAULT CHOICE: Remove all helper text
-------------------------------------------------------------------*/
function removeHelperText() {
	for (var i = 0; i < helperTexts.length; i++) {
		helperTexts[i].parentNode.removeChild(helperTexts[i]);
	}
}


/*===================================================================
***** VISUAL MANIPULATION: ADDING ELEMENTS
===================================================================*/

/*-------------------------------------------------------------------
********* SHOW DEFAULT
Show which project is the default project upon load, by making that
star a filled-in one.
-------------------------------------------------------------------*/

/*-------------------------------------------------------------------
********* ADD 'UNSORTED' EMPTY ICON
-------------------------------------------------------------------*/
function addUnsortedEmpty(projectPos) {
	// Create unsorted's empty icons & add it to the 'Unsorted' project header
	var emptyUnsortedIcon = document.createElement('img');
	emptyUnsortedIcon.src = 'images/empty.svg';
	emptyUnsortedIcon.classList.add('empty');
	emptyUnsortedIcon.id = 'emptyUnsorted';
	projectsToAddIcons[projectPos].appendChild(emptyUnsortedIcon);

	// Set activities that'll occur upon user hover & click
	emptyUnsortedIcon.addEventListener('mouseenter', function() { changeEmptyIconStart(projectPos); }, false);
	emptyUnsortedIcon.addEventListener('mouseout', function() { changeEmptyIconEnd(projectPos); }, false);
	emptyUnsortedIcon.addEventListener('click', function() { emptyProject(projectPos); }, false);
}

/*-------------------------------------------------------------------
********* ADD EMPTY ICON
-------------------------------------------------------------------*/
function addEmpty(projectPos) {
	// Create unsorted's empty icons & add it to the 'Unsorted' project header
	var emptyIcon = document.createElement('img');
	emptyIcon.src = 'images/empty.svg';
	emptyIcon.classList.add('empty');
	projectsToAddIcons[projectPos].appendChild(emptyIcon);

	// Set activities that'll occur upon user hover & click
	emptyIcon.addEventListener('mouseenter', function() { changeEmptyIconStart(projectPos); }, false);
	emptyIcon.addEventListener('mouseout', function() { changeEmptyIconEnd(projectPos); }, false);
	emptyIcon.addEventListener('click', function() { emptyProject(projectPos); }, false);
}

/*-------------------------------------------------------------------
********* Empty icon: Upon hover
When you hover over an empty icon, change the image to the black 'x'
-------------------------------------------------------------------*/
function changeEmptyIconStart(projectPos) {
	emptyIcons[projectPos].src = 'images/empty-hover.svg'; // change to black 'x'

	// Initialize variables
	var top = emptyIcons[projectPos].getBoundingClientRect().top;
	var left = emptyIcons[projectPos].getBoundingClientRect().left;
	var topOffset = 0;

	// Create helper text
	var helperText = document.createElement('p');
	helperText.classList.add('helperText');
	helperText.style.left = left - 4 + "px";

	if (projectPos !== 0) {
		var height = projectHeaders[0].offsetHeight; // Get the height of a projectHeader
		var unsortedEmptyIcon = document.getElementById("emptyUnsorted");
		topOffset = unsortedEmptyIcon.getBoundingClientRect().top; // get the Unsorted empty icon's offset from the top

		// Edit helper text before adding it to the page
		helperText.textContent = 'Delete project';
		helperText.style.top = top - topOffset + height + 16 + "px";
	} else {
		// Edit helper text before adding it to the page
		helperText.textContent = 'Empty this project';
		helperText.style.top = top - topOffset - 23 + "px";
	}

	document.body.appendChild(helperText);
}

/*-------------------------------------------------------------------
********* Empty icon: After hover
When you stop hovering over the empty icon, image is a white 'x'
-------------------------------------------------------------------*/
function changeEmptyIconEnd(projectPos) {
	emptyIcons[projectPos].src = 'images/empty.svg';
	removeHelperText();
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

/*-------------------------------------------------------------------
********* EMPTY/DELETE A PROJECT
If the project is the 'Unsorted' project, clear the links. If it is 
any other project, then delete the project entirely.
-------------------------------------------------------------------*/
function emptyProject(projectPos) {
	// Confirm deletion
	chrome.storage.local.get(null, function(item) {
		var projectName = item.projects[projectPos].name;

		// Partially conceal the extension w/ a dark background
		document.body.appendChild(coverup);

		// Add modal asking for deletion confirmation
		var modal = document.createElement('div');
		modal.classList.add('modal');
		modal.innerHTML = '<p><center id="modalCenter">Are you sure you want to delete <i>' + projectName + '</i>?<br><br></center></p>';
		document.body.appendChild(modal);

		var modals = document.getElementsByClassName('modal')[0];
		var deleteButton = document.createElement('button');
		deleteButton.classList.add('confirmProjectDelete', 'flatButton');
		deleteButton.innerHTML = 'DELETE';
		deleteButton.addEventListener("click", function () {
			coverup.parentNode.removeChild(coverup);
			modals.parentNode.removeChild(modals);

			//Change behavior depending on whether this is the 'Unsorted' project
			var questions = document.getElementsByClassName('questions');

			if (projectPos === 0) {
				var numQuestions = item.projects[0].questions.length;

				//Clear all of the questions
				item.projects[0].questions.splice(0, numQuestions);

				chrome.storage.local.set(item);

				// Visually clear the questions in 'Unsorted'
				questions[0].innerHTML = '';
			} else {
				// Delete the project
				item.projects.splice(projectPos, 1);

				chrome.storage.local.set(item);

				// Visually delete the project from view & recolor headers
				questions[projectPos].parentNode.removeChild(questions[projectPos]);
				colorHeaders();
			}
		})
		modalCenter = document.getElementById('modalCenter');
		modalCenter.appendChild(deleteButton);

		var keepButton = document.createElement('button');
		keepButton.classList.add('confirmKeep', 'flatButton');
		keepButton.innerHTML = 'NO';
		keepButton.addEventListener("click", function () {
			coverup.parentNode.removeChild(coverup);
			modals.parentNode.removeChild(modals);
		})
		modalCenter.appendChild(keepButton);
	});
}


/*===================================================================
***** MANIPULATING DATA: REORGANIZATION
Reorganization changes, such as moving around links, & reordering
projects.
===================================================================*/
function addStar(i) {
	$("<img src='images/star.svg' class='star'>")
		.appendTo($(".addIcons").eq(i))
		.hover(function() {
			$(this).attr("src", "images/star-chosen.svg");

			// Get the position of the 'empty' icon so we can accurately position the
			// helper text
			var top = $(".star").eq(i).offset().top;
			var left = $(".star").eq(i).offset().left;

			var height = $(".projectHeader").eq(i).height(); // Get the height of a projectHeader
			var topOffset = 0;

			if (i !== 0) {
				// Get the X position of the emptyUnsorted icon so that we can position the other helpertext boxes relative to that
				topOffset = $("#emptyUnsorted").offset().top;

				$('<p class="helperText">Make default</p>')
				.appendTo("body")
				.css({
					"top": top - topOffset + height + 18 + "px",
					"left": left - 16 + "px"
				});
			} else {
				$('<p class="helperText">Make default</p>')
				.appendTo("body")
				.css({
					"top": top - topOffset - 21 + "px",
					"left": left - 16 + "px"
				});
			}			
		}, function() {
			$(this).attr("src", "images/star.svg");
			$(".helperText").remove();
		})
		.click(function() {
			setDefault(i);
		});
}

/*-------------------------------------------------------------------
********* SET DEFAULT PROJECT
Change the project that links are automatically added to.
-------------------------------------------------------------------*/
function setDefault(newDefault) {
	chrome.storage.local.get(null, function(item) {
		// Hold on to the previous default project
		var prevDefault = item.settings.defaultProject;
		console.log("Previous default was " + prevDefault);
		console.log("New default is " + newDefault);

		// Replace the star of the previous default so that things happen when you hover, click, etc.
		$(".star").eq(prevDefault).remove();

		// +1 because the 'Unsorted' divider doesn't have the class addIcons, but we need to place this star as if it did
		showDefaultProject();
		addStar(prevDefault);

		// Change the current default project to the user selection
		item.settings.defaultProject = newDefault;
		console.log("You switched the project that links will automatically be added to. Now, new links are automatically added to " + item.projects[newDefault].name + " (Project #" + (newDefault + 1) + ").");

		chrome.storage.local.set(item, function() {
			console.log("Your new default project has been saved.");

			// derp derp, idk how to solve the problem of visually representing the change
			// without doing a refresh;
			window.location.href = window.location.href
		});
	});	
}

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
	window.location.href = window.location.href; // refresh
}

// window.onbeforeunload = function() {
// 	saveEdits();
// }

$(window).unload(function() {
	saveEdits();
});
