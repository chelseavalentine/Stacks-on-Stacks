/////////////// GLOBAL VARIABLES
var inputs = document.getElementsByTagName('input');
var projects = document.getElementById('projects');
var project = document.getElementsByClassName('project');
var createButton = document.getElementById('create');
var editButton = document.getElementById('edit');
var saveButton = document.getElementById('save');
var saveEditsButton = document.getElementById('saveEdits');
var deleteIcons = document.getElementsByClassName('deleteIcon');
var goToIcons = document.getElementsByClassName('goToIcon');

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

    saveButton.style.display = 'block'; // Show save button
}

/*-------------------------------------------------------------------
********* SAVE NEW PROJECTS
-------------------------------------------------------------------*/
function saveNewProjects() {
    var newProjects = $('.newproject');

    chrome.storage.local.get(null, function(items) {
        for (var i = 0; i < newProjects.length; i++) {
            var createdProject = {
                'name': newProjects.eq(i).val(),
                'questions': []
            };

            items.projects.push(createdProject);
            $(".newproject").eq(i).removeClass("newproject");
        }

        chrome.storage.local.set(items);
    });

    colorHeaders(); // color all of the new projects too

    saveButton.style.display = 'none';

    // disable all input fields
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].disabled = true;
    }
}

/*-------------------------------------------------------------------
********* EDIT PROJECTS
-------------------------------------------------------------------*/
// This will hold our current question IDs in their order
var questions = [];

function editProjects() {
    // Switch button shown from edit --> save button
    editButton.style.display = 'none';
    saveEditsButton.style.display = 'block';
    saveEditsButton.style.left = '160px';

    // Make all of the project headers, except for 'Unsorted' editable
    for (var i = 1; i < inputs.length; i++) {
        inputs[i].disabled = false;
        inputs[i].addEventListener('keyup', function(e) {
            if (e.which == 13) {
                saveEditsButton.click();
                this.disabled = true;
            }
        });
    }
    
    var questionTitles = document.getElementsByClassName('questionTitle');
    var titles = document.getElementsByClassName('title');

    for (var j = 0; j < questionTitles.length; j++) {
        questionTitles[j].removeEventListener('click');
        questionTitles[j].style.cursor = 'move'; // Indicate that questions are draggable
        questionTitles[j].draggable = true; // Make questions draggable

        titles[j].removeEventListener('click');
        titles[j].style.cursor = 'move'; // Indicate that questions are draggable
        titles[j].draggable = true; // Make questions draggable
    }

    $(".questions").sortable({
        connectWith: '.questions'
    });

    // Make it so that double clicking on a header title won't hide all questions
    for (var k = 0; k < project.length; k++) {
        project[k].removeEventListener('dblclick');
    }

    // Remove the current 'go to' & 'delete' buttons
    $(".deleteIcon").remove();
    $(".goToIcon").remove();
    for (var l = 0; l < deleteIcons.length; l++) {
        console.log(l);
        deleteIcons[l].parentNode.removeChild(deleteIcons[l]);
        goToIcons[l].parentNode.removeChild(goToIcons[l]);
    }

    // Save a list of the questions' ID values so we know their ordering
    questions = []; // reset the array of ID values
    var questionNum = 0 ; // init
    var questionses = document.getElementsByClassName('questions');
    var ourQuestions = document.getElementsByClassName('question');

    for (var m = 0; m < questionses.length; m++) {
        questions.push([]);
        for (var n = 0; n < questionses[m].children.length; n++, questionNum++) {
            ourQuestions[questionNum].id = m + ',' + n; // to make it easier, let's just assign it an integer
            questions[m].push([m, n]);
        }
    }
}

/*-------------------------------------------------------------------
********* SAVE EDITS TO PROJECTS
-------------------------------------------------------------------*/
function saveEdits() {
    var questionses = document.getElementsByClassName('questions');

    // Show the edit button again & hide show button
    editButton.style.display = 'block';
    saveEditsButton.style.display = 'none';

    // Get the changed order of the questions
    var newOrder = []; // reset the array of ID values
    var questionNum = 0; // init
    for (var i = 0; i < questionses.length; i++) {
        newOrder.push([]);
        for (var j = 0; j < questionses[i].children.length; j++, questionNum++) {
            var newQuestionIndex = document.getElementsByClassName('question')[questionNum].id; // to make it easier, let's just assign it an integer
            newOrder[i].push(newQuestionIndex);
        }
    }

    var newQuestions = [],
        dimensions,
        firstNum,
        secondNum;

    chrome.storage.local.get(null, function(item) {
        // Save each of the project headers
        for (var k = 1; k < inputs.length; k++) {
            item.projects[k].name = inputs[k].value;
        }

        for (var l = 0; l < newOrder.length; l++) {
            newQuestions.push([]);

            for (var m = 0; m < newOrder[l].length; m++) {
                dimensions = newOrder[l][m].split(',');

                //get first number & last number
                firstNum = parseInt(dimensions[0]);
                secondNum = parseInt(dimensions[1]);

                var addObject = item.projects[firstNum].questions[secondNum];
                newQuestions[l].push(addObject);
            }
        }

        for (var n = 0; n < item.projects.length; n++) {
            item.projects[n].questions = newQuestions[n];
        }
        
        // Set the reordered projects...
        chrome.storage.local.set(item);
    });

    for (var o = 0; o < inputs.length; o++) {
        inputs[o].disabled = true;
    }

    // window.location.href = window.location.href; // refresh
}
