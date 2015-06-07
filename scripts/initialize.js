(function() {
	settingsInit();
	projectsInit();
	giveAdminButtonsFunctionality();
})();


function settingsInit() {
	chrome.storage.local.get('settings', function(item) {
		if (Object.keys(item).length === 0) {
			chrome.storage.local.set({
				'settings':{
					'defaultProject': 0
				}
			});

			window.location.href = window.location.href;
		}
	});
}


function projectsInit() {
	chrome.storage.local.get('projects', function(item) {
		if (Object.keys(item).length === 0) {
			chrome.storage.local.set({
				'projects':[{
					'name': 'Unsorted',
					'questions': []
				}]
			}, function(){
				console.log('The projects have been initialized.');
			});

			window.location.href = window.location.href;
		} else {
			getProjects();
			getProjectQuestions();
		}
	});
}


function giveAdminButtonsFunctionality() {
	var createButton = document.getElementById('create'),
		editButton = document.getElementById('edit'),
		saveButton = document.getElementById('save'),
		saveEditsButton = document.getElementById('saveEdits');

	createButton.addEventListener('click', function() {createProject();});
	createButton.addEventListener('mouseenter', function() {
		document.getElementById('createAdminText').style.display = 'block';
	});
	createButton.addEventListener('mouseleave', function() {
		document.getElementById('createAdminText').style.display = 'none';
	});

	editButton.addEventListener('click', function() {editProjects();});
	editButton.addEventListener('mouseenter', function() {
		document.getElementById('editAdminText').style.display = 'block';
	});
	editButton.addEventListener('mouseleave', function() {
		document.getElementById('editAdminText').style.display = 'none';
	});
	
	saveButton.addEventListener('click', function() {saveNewProjects();});
	saveEditsButton.addEventListener('click', function() {saveEdits();});
}
