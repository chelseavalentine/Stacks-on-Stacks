/*===================================================================
---------------------------------------------------------------------
* VISUAL MANIPULATION
-
All of the functions that deal with changes of images, colors, etc.
---------------------------------------------------------------------
===================================================================*/


/*===================================================================
***** VISUAL MANIPULATION: VISUAL CHANGES
===================================================================*/

/*-------------------------------------------------------------------
********* COLOR PROJECT HEADERS
-------------------------------------------------------------------*/
function colorHeaders() {
	var headers = $(".projectHeader").length;
	for (var i = 0; i < headers; i++) {
		$(".projectHeader")
			.eq(i)
			.css({
				"background-color": bgcolors[i%bgcolors.length]
			});
	}
}

/*-------------------------------------------------------------------
********* SHOW NEW DEFAULT CHOICE
When projects are loaded in, show the project which is the default
project that links are added into by replacing its star with a star
that doesn't change to an unfilled star when hovered over.
-------------------------------------------------------------------*/
function showDefaultProject() {
	chrome.storage.local.get(null, function(item) {
		// get index of current default project
		var currentDefault = item.settings.defaultProject;

		// remove the current star of the current project
		$(".star").eq(currentDefault).remove();

		//add a new function-less star
		$("<img src='images/star-chosen.svg' class='star'>")
			.appendTo($(".addIcons").eq(currentDefault))
			// add helper text to clarify that this is the default place links are added to
			.hover(function() {
				var top = $(".star").eq(currentDefault).offset().top;
				var left = $(".star").eq(currentDefault).offset().left;

				var height = $(".projectHeader").eq(currentDefault).height();
				var topOffset = $("#emptyUnsorted").offset().top;

				$('<p class="helperText">This is the default project.</p>')
					.appendTo("body")
					.css({
						"top": top - topOffset + height + 18 + "px",
						"left": left - 16 + "px"
					});
			}, function() {
				$(".helperText").remove();
			});
	});
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
function addUnsortedEmpty(i) {
	$("<img src='images/empty.svg' class='empty' id='emptyUnsorted'>")
		.appendTo($(".addIcons").eq(i))
		.hover(function() {
			changeEmptyIconStart(i);
		}, function() {
			changeEmptyIconEnd(i);
		})
		.click(function() {
			emptyProject(i);
		});
}

/*-------------------------------------------------------------------
********* ADD EMPTY ICON
-------------------------------------------------------------------*/
function addEmpty(i) {
	$("<img src='images/empty.svg' class='empty' id='emptyUnsorted'>")
		.appendTo($(".addIcons").eq(i))
		.hover(function() {
			changeEmptyIconStart(i);
		}, function() {
			changeEmptyIconEnd(i);
		})
		.click(function() {
			emptyProject(i);
		});
}

/*-------------------------------------------------------------------
********* Empty icon: Upon hover
When you hover over an empty icon, change the image to the black 'x'
-------------------------------------------------------------------*/
function changeEmptyIconStart(i) {
	$(".empty").eq(i).attr("src", "images/empty-hover.svg");
	
	//Get position of 'empty' icon to position helper text
	var top = $(".empty").eq(i).offset().top;
	var left = $(".empty").eq(i).offset().left;
	var topOffset = 0;

	if (i !== 0) {
		var height = $(".projectHeader").eq(0).height(); // Get the height of a projectHeader

		//Get the X position of the emptyUnsorted icon so that we can position the other helpertext boxes relative to that
		topOffset = $("#emptyUnsorted").offset().top;

		$('<p class="helperText">Delete project</p>')
			.appendTo("body")
			.css({
				"top": top - topOffset + height + 16 + "px",
				"left": left - 4 + "px"
		});
		console.log("mofoooo " + topOffset);
	} else {
		$('<p class="helperText">Delete project</p>')
		.appendTo("body")
		.css({
			"top": top - topOffset - 23 + "px",
			"left": left - 4 + "px"
		});
	}
}

/*-------------------------------------------------------------------
********* Empty icon: After hover
When you stop hovering over the empty icon, restore the image to the
white 'x'
-------------------------------------------------------------------*/
function changeEmptyIconEnd(i) {
	$(".empty").eq(i).attr("src", "images/empty.svg");
	$(".helperText").remove();
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
function deleteLink(link, projectIndex) {
	// Initialize variable(s).
	var found = false;

	chrome.storage.local.get(null, function(item) {

		//Search through all of the links in the desired project
		for (var i = 0; i < item.projects[projectIndex].questions.length; i++ ) {
			if (link === JSON.stringify(item.projects[projectIndex].questions[i].link)) {
				// found object to delete from storage
				item.projects[projectIndex].questions.splice(i, 1);
				found = true;
				break;
			}
		}
	
		if (found) {
			chrome.storage.local.set(item, function() {
				console.log(link + ' has been deleted from the storage.');
			});
		} else {
			console.log(link + ' was not found in the storage.');
		}
	});
}

/*-------------------------------------------------------------------
********* EMPTY/DELETE A PROJECT
If the project is the 'Unsorted' project, clear the links. If it is 
any other project, then delete the project entirely.
-------------------------------------------------------------------*/
function emptyProject(i) {
	// Get this icon's index, which is also the index of the project
	var thisIndex = i;

	// Confirm deletion
	chrome.storage.local.get(null, function(item) {
		var projectName = item.projects[thisIndex].name;

		// Partially conceal the extension w/ a dark background
		$('<div class="cover"></div>').appendTo("body");

		// Add modal asking for deletion confirmation
		$('<div class="modal"><center id="modalCenter"><p class="modalText">Are you sure you want to delete <i>' + projectName + '</i>?</p><br></center></div>').appendTo("body");

		var confirmation = false;

		// Add flat delete button
		$('<button class="confirmProjectDelete flatButton">DELETE</button>')
			.appendTo("#modalCenter")
			.click(function () {
				confirmation = true;
				$(".cover, .modal").remove();

				//Change behavior depending on whether this is the 'Unsorted' project
				if (i === 0) {
					var numQuestions = Object.keys(item.projects[0].questions.length);

					//Clear all of the questions
					item.projects[0].questions.splice(0, len);

					chrome.storage.local.set(item, function() {
						console.log("All of the links in " + projectName + " were sucessfully deleted from storage.");
					});

					// Visually clear the questions in 'Unsorted'
					$(".questions").eq(0).empty();
				} else {
					// Delete the project
					item.projects.splice(thisIndex, 1);

					chrome.storage.local.set(item, function() {
						console.log("The project '" + projectName + "'' was successfully deleted from storage.");
					});

					// Visually delete the project from view
					$(".project").eq(thisIndex).remove();
				}
			});

		// Add flat keep button
		$('<button class="confirmKeep flatButton">NO</button>')
			.appendTo("#modalCenter")
			.click(function () {
				confirmation = false;
				$(".cover, .modal").remove();
			});
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
			window.location.reload();
		});
	});	
}

/*-------------------------------------------------------------------
********* EDITTING PROJECT HEADERS
Edit a project's title
-------------------------------------------------------------------*/
// This will hold our current question IDs in their order
var questions = [];

$("#edit")
	.click(function() {
		$(this).hide(0);
		$("#saveEdits")
			.show(0)
			.css({
				"left": "160px"
			});

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

	var newQuestions = [];
	var dimensions;
	var firstNum;
	var secondNum;

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
		})
	})

	$("input").disabled = true;
	window.location.reload();
}

$(window).unload(function() {
	saveEdits();
})