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

    exitNewProjectUI();
}

function exitNewProjectUI() {
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



function saveProjectEdits() {
    var newQuestionOrder = [];

    exitEditProjectUI();
    newQuestionOrder = getChangedQuestionOrder();

    saveProjectTitles();
    saveNewQuestionOrder(newQuestionOrder);
    disableInputFields();
}

function exitEditProjectUI() {
    var editButton = document.getElementById('edit'),
        saveEditsButton = document.getElementById('saveEdits');

    editButton.style.display = 'block';
    saveEditsButton.style.display = 'none';
}

function getChangedQuestionOrder() {
    var groupsOfQuestions = document.getElementsByClassName('questions'),
        questionNumber = 0,
        questions = document.getElementsByClassName('question'),
        currentQuestionOrder = [],
        newQuestionIndex;

    for (var i = 0; i < groupsOfQuestions.length; i++) {
        currentQuestionOrder.push([]);

        for (var j = 0; j < groupsOfQuestions[i].children.length; j++, questionNumber++) {
            newQuestionIndex = questions[i].id;
            currentQuestionOrder[i].push(newQuestionIndex);
        }
    }
}

function saveProjectTitles() {
    var projectTitles = document.getElementsByTagName('input');

    chrome.storage.local.get(null, function(item) {
        for (var i = 1; i < projectTitles.length; i++) {
            item.projects[i].name = projectTitles[i].value;
        }

        chrome.storage.local.set(item);
    })
}

function saveNewQuestionOrder(newQuestionOrder) {
    var questions = [],
        projectIndex, questionIndex;

    chrome.storage.local.get(null, function(item) {
        for (var i = 0; i < newQuestionOrder.length; i++) {
            for (var j = 0; j < newQuestionOrder[i].length; j++) {
                questionCoordinates = newQuestionOrder[i][j].split(',');
                projectIndex = parseInt(questionCoordinates[0]);
                questionIndex = parseInt(questionCoordinates[1]);
                questions.push(item.projects[projectIndex].questions[questionIndex]);
            }
        }

        for (var k = 0; k < item.projects.length; k++) {
            item.projects[k].questions = questions[k];
        }

        chrome.storage.local.set(item);
    });
}
