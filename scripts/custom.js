function checkIfInitialized() {
	chrome.storage.local.get('data', function(item) {
		if (Object.keys(item).length === 0) { // initialize storage
			chrome.storage.local.set({'data':[]}, function(){
				console.log('storage initialized');
			})
		} else { // storage exists
			getAllLinks();
			clear();
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
			clear();
		}
	});
}


// THIS WORKS
function getProjects() {
	return chrome.storage.local.get(null, function(items) {
		if (!chrome.runtime.error) {
			for (var i = 0; i < items['projects'].length; i++) {
				var name =  JSON.stringify(items['projects'][i]['name']);
				console.log(name);

				$('<div class="project"><div class="projectHeader"><p class="projectTitle"><input class="newproject" value=' + name + ' disabled></p></div><div class="questions"></div></div>')
					.insertAfter($(".project").eq($(".project").length-1))
			}
		} else {
			console.log("welps");
		}
	});
}


function deleteLink(link) {
	var found = false;
	chrome.storage.local.get(null, function(item) {
		for (var i = 0; i < item['data'].length; i++ ) {
			if (link === JSON.stringify(item['data'][i]['link'])) {
				// found object to delete from storage
				console.log(item['data']);
				item['data'].splice(i, 1);
				console.log(item['data']);
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

				answer = answer.substring(1, answer.length-40);

				//check to see whether the question was cut to see whether we should add the ...
				if (oldQuestion.length > 62) {
					var question = oldQuestion.substring(1, 60) + "...";
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


					$('<div class="answer"><p class="answerText">' + answer + '</p></div>')
						.insertAfter(document.getElementById('title' + i));

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
		}
	});
}


$(function(){
	checkIfInitialized();
	projectInit();
})


function clear() {
	$("#clearthis").click(function() {
		chrome.storage.local.get(null, function(item) {
			item['data'].splice(0, item['data'].length);
			chrome.storage.local.set(item, function() {
				console.log('clear all');
			});
		});
	});
}
