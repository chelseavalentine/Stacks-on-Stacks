var inputs = document.getElementsByTagName('input');
var projects = document.getElementById('projects');

/*-------------------------------------------------------------------
********* CREATE PROJECT
-------------------------------------------------------------------*/
function createProject() {
	/////////////// CREATE A PROJECT
	// Project > (Project header > [Project Name > Input Project] & [Questions])

	// Project
	var divProject = document.createElement('div');
	divProject.classList.add('project');

	// Project header
	var divProjectHeader = document.createElement('div');
	divProjectHeader.classList.add('projectHeader');

	// Project name
	var pProjectName = document.createElement('p');
	pProjectName.classList.add('projectTitle', 'addIcons');

	// Input project
	var inputProjectName = document.createElement('input');
	inputProjectName.maxlength = 21;
	inputProjectName.classList.add('newproject');

	// Also save the project if the user presses enter
	inputProjectName.addEventListener('keyup', function(e) {
		if (e.which === 13) {
			document.getElementById('save').click();
		}
	});

	// Add input project, project name, & project header to project
	pProjectName.appendChild(inputProjectName);
	divProjectHeader.appendChild(pProjectName);
	divProject.appendChild(divProjectHeader);

	projects.appendChild(divProject);
	inputProjectName.focus();

	// Add 'Empty' and 'Star' icons
	var thisProjectIndex = inputs.length - 1;
	addEmpty(thisProjectIndex);
	addStar(thisProjectIndex);

	document.getElementById('save').style.display = 'block'; // Show save button
}


$("#save").click(function() {
	var newProjects = $('.newproject');

	chrome.storage.local.get(null, function(items) {
		for (var i = 0; i < newProjects.length; i++) {
			var createdProject = {
				'name': newProjects.eq(i).val(),
				'questions': []
			};
			items['projects'].push(createdProject);
		}
		chrome.storage.local.set(items)
	})

	colorHeaders(); // Color all of the new projects too
	this.style.display = 'none';

	// disable all input fields
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = true;
	}
})

