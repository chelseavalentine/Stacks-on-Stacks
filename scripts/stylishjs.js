//If you click a project's title, the questions are hidden
$(".projectHeader").dblclick(function() {
	$(this).next().toggle(0);
})


//Background colors available
var bgcolors = ['#00bcd4', '#ff436c', '#8bc34a', '#ff9800'];

$("#create").click(function() {
	$('<div class="project"><div class="projectHeader"><p class="projectTitle"></p></div><div class="questions"></div></div>').insertAfter(
		$(".project").eq($(".project").length-1))
	var lastProjectTitle = $(".projectTitle").eq($(".projectTitle").length-1);

	$('<input value="Project" class="newproject">')
		.appendTo(lastProjectTitle)

	$("#save").show(0)
})


$("#save").click(function() {
	var newProjects = $('.newproject');
	var projects = [];
	console.log("All new projects are ");
	console.log(newProjects);

	chrome.storage.local.get(null, function(items) {
		for (var i = 0; i < newProjects.length; i++) {
			console.log(newProjects.eq(i).val())
			var createdProject = {'name': newProjects.eq(i).val()};
			items['projects'].push(createdProject);
			$(".newproject").eq(i).removeClass("newproject");
		}
		chrome.storage.local.set(items, function() {
			console.log("New projects were set.")
		})
	})

	//Color all of the new projects
	var projectheaders = $(".projectHeader");
	for (var i = 0; i < projectheaders.length; i++) {
		$(".projectHeader").eq(i).css({
			"background-color": bgcolors[i%bgcolors.length]
		})
	}

	$(this).hide(0)
	
})


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