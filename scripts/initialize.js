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
(function beginning() {
	settingsInit();
	projectsInit();
})();

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
			window.location.href = window.location.href; // Refresh window.
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
			});

			window.location.href = window.location.href; // Refresh window.
		}
	});
}
