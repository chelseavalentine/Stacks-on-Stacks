/*==================================================================
---------------------------------------------------------------------
* INITIALIZING THE LOCAL STORAGE
-
This checks whether individual data tables exist, and if they don't,
it will create the data table for you. 
---------------------------------------------------------------------
===================================================================*/

/*-------------------------------------------------------------------
********* STARTING FUNCTIONS
Execute these functions when jQuery loads/at the very beginning.
-------------------------------------------------------------------*/
$(function beginning() {
	settingsInit();
	projectsInit();
});

/*-------------------------------------------------------------------
********* INITIALIZE PROJECTS
Load in any created projects. If there aren't any, create an the
'Unsorted' project and prepare the storage to take in more projects.
-------------------------------------------------------------------*/
function projectsInit() {
	chrome.storage.local.get('projects', function(item) {
		if (Object.keys(item).length === 0) { // initialize storage
			chrome.storage.local.set({
				'projects':[{
					'name': 'Unsorted',
					'questions': []
				}]
			}, function(){
				console.log('The projects have been initialized.');
			});
			window.location.reload(); // Refresh window.
		} else { // projects exist
			getProjects(); // load in the projects
			getAllLinks(); // load in the projects' links
		}
	});
}

/*-------------------------------------------------------------------
********* INITIALIZE USER SETTINGS
Load in user settings. If they don't exist, set settings to make
'Unsorted' the default project that questions are added to.
-------------------------------------------------------------------*/
function settingsInit() {
	chrome.storage.local.get('settings', function(item) {
		if (Object.keys(item).length === 0) { // initialize storage
			chrome.storage.local.set({
				// Set 'unsorted' as the default project that things will be added to
				'settings':{
					'defaultProject': 0
				}
			}, function(){
				console.log('Your settings have been initialized.');
			});

			window.location.reload(); // Refresh window.
		} else {
			console.log("Your settings have been initialized before.");
		}
	});
}



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
				var name =  JSON.stringify(items.projects[i].name);

				// If it's the first project being loaded, then it is the 'Unsorted' project, and we want that to be first.
				if (i === 0) {
					$('<div class="project"><div class="projectHeader"><p class="projectTitle addIcons"><input value=' + name + ' disabled></p></div><div class="questions"></div></div><div class="answers"></div>')
						.insertAfter("#helpInsertProjects")
						.ready(function() {
							// Do these when the project loads in.
							colorHeaders();
							addUnsortedEmpty(i); // add emptyUnsorted icon
							addStar(i); // add star icon
						});
				} else {
					//Load all of the projects that aren't 'Unsorted' in a slightly different manner

					//Place the project after the current last project
					var placing = $(".project").eq($(".project").length - 1);

					$('<div class="project"><div class="projectHeader"><p class="projectTitle addIcons"><input value=' + name + ' disabled></p></div><div class="questions"></div></div><div class="answers"></div>')
						.insertAfter(placing)
						.ready(function() {
							// Do these when the project loads in.
							colorHeaders();
							addEmpty(i); // add emptyUnsorted icon
							addStar(i); // add star icon
						});
				}
			}
		} else {
			console.log("Welps. I failed to get all of the projects you requested.");
		}
	});
}

/*-------------------------------------------------------------------
********* GET QUESTIONS
Load in the questions for each of our projects.
-------------------------------------------------------------------*/
function getAllLinks(){
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
					var oldQuestion = JSON.stringify(items.projects[i].questions[j].question);
					var link = JSON.stringify(items.projects[i].questions[j].link);
					var answer = JSON.stringify(items.projects[i].questions[j].answer);
					var upvotes = JSON.stringify(items.projects[i].questions[j].upvotes);
					var question;

					// Get rid of the quotation marks " " around the data
					upvotes = upvotes.substring(1, upvotes.length-1);
					answer = answer.substring(1, answer.length-1).trim().replace(/\r?\\/g, '');

					// check whether the question is too long to see whether we should append '...'
					if (oldQuestion.length > 57) {
						question = oldQuestion.substring(1, 55) + "...";
						oldQuestion = oldQuestion.substring(1, oldQuestion.length-1);
					} else {
						question = oldQuestion.substring(1, oldQuestion.length-1);
						oldQuestion = question;
					}

					/////////////// DISPLAY THE DATA TO THE USER
					// Create the dividers to display the data.

					(function(i, j, onThisQuestion, question, oldQuestion, link) {
						$('<div class="question" id="question' + i + "_" + j +'"></div>')
							.appendTo(document.getElementsByClassName('questions')[i]);

						$('<div class="title" id="title' + i + "_" + j + '"><p class="questionTitle">' + question + '</p><a target="_blank" href=' + link + '><img src="images/go.svg" class="icon"></a></div>')
							.appendTo(document.getElementById('question' + i + "_" + j))
							.click(function() {
								var clicks = $(this).data('clicks');
								$(this).next().toggle(0);
								if (clicks) {
									$("#title" + i + "_" + j).children().eq(0).text(question);
								} else {
									$("#title" + i + "_" + j).children().eq(0).text(oldQuestion);
								}

								$(this).data("clicks", !clicks);
							});

						$('<div class="answer" id="answer' + i + j +'"><center><p class="answerText">' + answer + '</p><p class="upvotes">+' + upvotes +'</p></center></div>')
							.insertAfter($("#title" + i + "_" + j));

						$(".upvotes")
							.eq(onThisQuestion)
							.css({
								"top": 0,
								"right": "5px"
							});


						$('<img src="/images/delete.svg" class="icon deleteIcon"></div>')
							.appendTo(document.getElementsByClassName('title')[onThisQuestion]).click(function() {
								var deleteTest;
								chrome.storage.local.get(null, function(item) { 
									$("#question" + i + "_" + j).remove();
									deleteLink(link, i);
								});
							});          
					}(i, j, onThisQuestion, question, oldQuestion, link));
				}
			}

			//Add open in new tab property to every <a>
			var links = $("a");
			for (var i = 0; i < links.length; i++) {
				$("a").eq(i).attr("target", "_blank");
			}

			//get rid of empty <p> tags
			$("p").each(function() {
				if ($(this).html().replace(/\s|&nbsp;/g, '').length === 0) {
					$(this).remove();
				}
			});
		}
	});
}



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
If
-------------------------------------------------------------------*/


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
function addStar(i){
	var chosen = false;

	$("<img src='images/star.svg' class='star'>")
		.appendTo($(".addIcons").eq(i))
		.hover(function() {
			if (chosen === false) {

			}
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
		item.settings.defaultProject = newDefault;
		console.log("You switched the project that links will automatically be added to. Now, new links are automatically added to " + item.projects[newDefault].name + " (Project #" + (newDefault + 1) + ").");

		chrome.storage.local.set(item, function() {
			console.log("Your new default project. has been saved.");
		});
	});
}
