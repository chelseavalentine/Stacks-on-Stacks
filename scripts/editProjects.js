/////////////// GLOBAL VARIABLES
var inputs = document.getElementsByTagName('input');

var project = document.getElementsByClassName('project');
var createButton = document.getElementById('create');
var editButton = document.getElementById('edit');
var saveButton = document.getElementById('save');
var saveEditsButton = document.getElementById('saveEdits');
var deleteIcons = document.getElementsByClassName('deleteIcon');
var goToIcons = document.getElementsByClassName('goToIcon');


function buildProjectShell(project) {
    var projects = document.getElementById('projects'),
        saveButton = document.getElementById('save'),
        header, title, inputField;

    project = document.createElement('div');
    project.classList.add('project');

    header = document.createElement('div');
    header.classList.add('projectHeader');

    title = document.createElement('p');
    title.classList.add('projectTitle', 'addIcons');

    inputField = document.createElement('input');
    inputField.maxlength = 21;
    inputField.classList.add('newproject');
    inputField.addEventListener('keyup', function(e) {
        if (e.which === 13) {
            saveButton.click();
        }
    });
    inputField.focus();

    title.appendChild(inputField);
    header.appendChild(title);
    project.appendChild(header);

    projects.appendChild(project);

    return project;
}

function createProject() {
    var inputTags = document.getElementsByTagName('input'),
        saveButton = document.getElementById('save'),
        project, projectIndex;

    project = buildProjectShell(project);

    projectIndex = inputTags.length - 1;
    addEmptyAndStarIcons(projectIndex);

    saveButton.style.display = 'block'; // Show save button
}

function addEmptyAndStarIcons(projectIndex) {
    addEmpty(projectIndex);
    addStar(projectIndex);
}


function saveNewProjects() {
    var newProjects = document.getElementsByClassName('newproject'),
        inputTags = document.getElementsByTagName('input'),
        saveButton = document.getElementById('save'),
        createdProject;

    chrome.storage.local.get(null, function(items) {
        for (var i = 0; i < newProjects.length; i++) {
            createdProject = {
                'name': newProjects[i].value,
                'questions': []
            };

            items.projects.push(createdProject);
            newProjects[i].classList.remove('newproject');
        }

        chrome.storage.local.set(items);
    });

    clearNewProjectUI();
}

function clearNewProjectUI() {
    colorHeaders();
    disableInputFields();
    saveButton.style.display = 'none';
}

function disableInputFields() {
    var inputTags = document.getElementsByTagName('input');

    for (var i = 0; i < inputTags.length; i++) {
        inputTags[i].disabled = true;
    }
}


function editProjects() {
    var originalQuestionOrder = [];

    enterEditProjectUI();
    makeProjectHeadersEditable();
    makeQuestionsDraggable();
    removeDoubleClickToHideQuestions();
    removeDeleteAndGotoIcons();

    // Save a list of the questions' ID values so we know their ordering
    originalQuestionOrder = createListOfQuestionIDs();
}

function enterEditProjectUI() {
    var editButton = document.getElementById('edit'),
        saveEditsButton = document.getElementById('saveEdits');

    editButton.style.display = 'none';
    saveEditsButton.style.display = 'block';
    saveEditsButton.style.left = '160px';
}

function makeProjectHeadersEditable() {
    var inputTags = document.getElementsByTagName('input'),
        saveEditsButton = document.getElementById('saveEdits');

    // Make all of the project headers, except for 'Unsorted' editable
    for (var i = 1; i < inputTags.length; i++) {
        inputTags[i].disabled = false;
        inputTags[i].addEventListener('keyup', function(e) {
            if (e.which == 13) {
                saveEditsButton.click();
                this.disabled = true;
            }
        });
    }
}

function makeQuestionsDraggable() {
    $(".question").sortable({
        connectWith: '.questions'
    });
}

function makeQuestionsLookDraggable() {
    var question = document.getElementsByClassName('questionTitle'),
        divider = document.getElementsByClassName('title');

    for (var i = 0; i < question.length; i++) {
        question[i].removeEventListener('click');
        question[i].style.cursor = 'move';
        question[i].draggable = true;

        divider[i].removeEventListener('click');
        divider[i].style.cursor = 'move';
        divider[i].draggable = true;
    }
}

function removeDoubleClickToHideQuestions() {
    var projects = document.getElementsByClassName('project');

    for (var i = 0; i < projects.length; i++) {
        projects[i].removeEventListener('dblclick');
    }
}

function removeDeleteAndGotoIcons() {
    $('.deleteIcon, .goToIcon').remove();
}

function createListOfQuestionIDs() {
    var currentQuestionOrder = [],
        questionNumber = 0,
        groupsOfQuestions = document.getElementsByClassName('questions'),
        questions = document.getElementsByClassName('question');

    for (var i = 0; i < groupsOfQuestions.length; i++) {
        currentQuestionOrder.push([]);

        for (var j = 0; j < groupsOfQuestions[i].children.length; j++, questionNumber++) {
            questions[questionNumber].id = i + ',' + j;
            currentQuestionOrder[i].push([i, j]);
        }
    }

    return currentQuestionOrder;
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
