/*
* function checks storage to see if 'data' JSON blob used for links storage has been initialized or not. If initialized, do nothing; else, initialize empty 'data' array.
* */
function checkIfInitialized() {
	chrome.storage.local.get('data', function(item) {
		if (Object.keys(item).length === 0) { // initialize storage
			chrome.storage.local.set({'data':[]}, function(){
				console.log('storage initialized');
			})
		} else { // storage exists
			getAllLinks();
			clearAll();
		}
	});
}


function projectInit() {
	chrome.storage.local.get('projects', function(item) {
		if (Object.keys(item).length === 0) { // initialize storage
			chrome.storage.local.set({'projects':[]}, function(){
				console.log('storage initialized');
			})
		} else { // storage exists
			getProjects();
		}
	});
}


// THIS WORKS
function getProjects() {
	return chrome.storage.local.get(null, function(items) {
		if (!chrome.runtime.error) {
			for (var i = 0; i < items['projects'].length; i++) {
				var name =  JSON.stringify(items['projects'][i]['name']);
				$('<div class="project"><div class="projectHeader"><p class="projectTitle"><input value=' + name + ' disabled></p></div><div class="questions"></div></div>')
					.insertAfter($(".project").eq($(".project").length-1))
					.ready(function() {
						var projectheaders = $(".projectHeader");
						for (var i = 0; i < projectheaders.length; i++) {
							$(".projectHeader").eq(i).css({
								"background-color": bgcolors[i%bgcolors.length]
							})
						}
					})
					.click(function() {
						$(this).next().toggle(0);
					})
			}
		} else {
			console.log("welps");
		}
	});
}

/*
* params {String link}
* Search storage for matching record with field that matches to the string and deletes it
* */
function deleteLink(link) {
	var found = false;
	chrome.storage.local.get(null, function(item) {
		for (var i = 0; i < item['data'].length; i++ ) {
			if (link === JSON.stringify(item['data'][i]['link'])) {
				// found object to delete from storage
				item['data'].splice(i, 1);
				found = true;
				break;
			}
		}
	
		if (found) {
			chrome.storage.local.set(item, function() {
				console.log(link + ' deleted from storage');
			})
		} else {
			console.log(link + ' not found in storage');
		}
	});
}


function getAllLinks(){
	return chrome.storage.local.get(null, function(items) {
		if(!chrome.runtime.error) {
			for (var i = 0; i < items['data'].length; i++) {
				var link =  JSON.stringify(items['data'][i]['link']);
				var oldQuestion =  JSON.stringify(items['data'][i]['question']);
				var answer = JSON.stringify(items['data'][i]['answer']);

				answer = answer.substring(1, answer.length-1).trim().replace(/\r?\\/g, '');

				//check to see whether the question should be cut to see whether we should add the ...
				if (oldQuestion.length > 57) {
					var question = oldQuestion.substring(1, 55) + "...";
					oldQuestion = oldQuestion.substring(1, oldQuestion.length-1);
				} else {
					var question = oldQuestion.substring(1, oldQuestion.length-1);
					oldQuestion = question;
				}

				(function(i, link, question, oldQuestion){
					$('<div class="question" id="question' + i +'"></div>')
						.appendTo(document.getElementsByClassName('questions')[0])

					$('<div class="title" id="title' + i + '"><p class="questionTitle">' + question + '</p><a target="_blank" href=' + link + '><img src="images/go.svg" class="icon"></a></div>')
						.appendTo(document.getElementById('question' + i))
						.click(function() {
							var clicks = $(this).data('clicks');
							$(this).next().toggle(0);
							if (clicks) {
								$("#title" + i).children().eq(0).text(question);
							} else {
								$("#title" + i).children().eq(0).text(oldQuestion);
							}

							$(this).data("clicks", !clicks);
						})


					$('<div class="answer"><center><p class="answerText">' + answer + '</p></center></div>')
						.insertAfter(document.getElementById('title' + i))
						.dblclick(function() {
							$(this).toggle();
						})

					$('<img src="/images/delete.svg" class="icon deleteIcon"></div>')
						.appendTo(document.getElementsByClassName('title')[i]).click(function() {
							var deleteTest;
							chrome.storage.local.get(null, function(item) { 
								$("#question" + i).remove();
								deleteLink(link);
							});
						});          
				})(i, link, question, oldQuestion);
			}

			//Add open in new tab property to every <a>
			var links = $("a");
			for (var i = 0; i < links.length; i++) {
				$("a").eq(i).attr("target", "_blank");
			}

			//get rid of empty <p> tags
			$("p").each(function() {
				if ($(this).html().replace(/\s|&nbsp;/g, '').length == 0) {
					$(this).remove();
				}
			})
		}
	});
}


$(function(){
	checkIfInitialized();
	projectInit();
})

/*
 * This function clears out all data in 'data' JSON blob where links are stored upon onclick and then sets the empty array back into storage
 */
function clearAll() {
	if(!chrome.runtime.error) {
		$("#clearthis").click(function() {
			var confirmation = confirm("Are you sure you want to delete all of the links in 'Unsorted'?");
			if (confirmation === true) {
				chrome.storage.local.get(null, function(item) {
					var len = Object.keys(item['data']).length;
					item['data'].splice(0, len);
					chrome.storage.local.set(item, function() {
						console.log("All links in 'Unsorted' were deleted from storage.");
					})
				});

				//Visually clear the questions in 'Unsorted'
				$(".questions").eq(0).empty();
			}
		});
	}
}

