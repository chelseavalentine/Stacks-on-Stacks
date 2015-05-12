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

			showDefaultProject(); // visually represent the current place links are added to
		} else {
			console.log("Welps. I failed to get all of the projects you requested.");
		}
	});
}

/*-------------------------------------------------------------------
********* GET QUESTIONS
Load in the questions for each of our projects.
-------------------------------------------------------------------*/
function getAllLinks() {
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
