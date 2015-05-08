//If you click a question's title, the best answer will be shown


//If you click a project's title, the questions are hidden
$(".projectHeader").click(function() {
   	$(this).next().toggle(0);
})


//Background colors available
var bgcolors = ['#00bcd4', '#ff436c', '#8bc34a', '#ff9800'];

$(document).ready(function() {
	var currentURL = window.location.href.toString();
	if (!(currentURL.indexOf("stackoverflow") >= 0)) {
		var projectheaders = $(".projectHeader");
		for (var i = 0; i < projectheaders.length; i++) {
			$(".projectHeader").eq(i).css({
				"background-color": bgcolors[i%bgcolors.length]
			})
		}
	}
})

$("#clearthis").click(function() {
	chrome.storage.local.clear();
})

// $("#newproject").on('keyup', function(e) {
// 	if (e.which == 13) {
// 		//add new project header
// 		var newName = $("#newproject").val();
// 		var newProject = {'name': newName};

// 		chrome.storage.local.get(null, function(item) {
// 			item['projects'].push(newProject);
// 		})
// 	}
// })

$("#create").click(function() {
	$('<div class="project"><div class="projectHeader"><p class="projectTitle"></p></div><div class="questions"></div></div>').insertAfter(
		$(".project").eq($(".project").length-1))
	var lastProjectTitle = $(".projectTitle").eq($(".projectTitle").length-1);

	$('<input value="Project" class="newproject">')
		.appendTo(lastProjectTitle)
})

$("#save").click(function() {
	var allProjects = document.getElementsByClassName('newproject');
	var projects = [];
	console.log("All projects are ");
	console.log(allProjects);

	for (var i = 0; i < allProjects.length; i++) {
		projects.push(allProjects[i].value);
	}

	console.log("pushed projects are ");
	console.log(projects);

	for (var i = 0; i < projects.length; i++) {
		chrome.storage.local.get(null, function (item) {
			item['projects'][i]['name'] = projects[i];
			chrome.storage.local.set(item, function() {
			console.log("set");
			})
		})
	}
	
})

// $(".container").click(function() {
// 	//disable the project titles
// 	//this.disabled = true;
// })

function saveLink(link, question, answer) {
	// prettify question & answer by taking out whitespaces, tabs, and null
	question = question.split(/\s+/).filter(function(e){return e===0 || e}).join(' ');
  answer = answer.replace(/\r?\n/g, '<br />').substring(16, 450);

  // check for duplicates
  obj = {'link': link, 'question': question, 'answer': answer};
  chrome.storage.local.get(null, function(item) {
    var isDup = false;

    if (!isDup) {
      item['data'].push(obj);
      chrome.storage.local.set(item, function(){
        console.log("");
      });
    }
  });
}