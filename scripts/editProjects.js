/////////////// GLOBAL VARIABLES
var inputs = document.getElementsByTagName('input');
var projects = document.getElementById('projects');
var createButton = document.getElementById('create');
var editButton = document.getElementById('edit');
var saveButton = document.getElementById('save');
var saveEditsButton = document.getElementById('saveEdits');

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

/*-------------------------------------------------------------------
********* SAVE NEW PROJECTS
-------------------------------------------------------------------*/
function saveNewProjects() {
    var newProjects = document.getElementsByClassName('.newproject');

    chrome.storage.local.get(null, function(items) {
        for (var i = 0; i < newProjects.length; i++) {
            var createdProject = {
                'name': newProjects[i].value,
                'questions': []
            };
            items.projects.push(createdProject);
        }
        chrome.storage.local.set(items);
    });

    colorHeaders(); // Color all of the new projects too
    this.style.display = 'none';

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
        input[i].addEventListener('keyup', function(e) {
            if (e.which == 13) {
                saveEditsButton.click();
                this.disabled = true;
            }
        });
    }
    
    var questionTitles = document.getElementsByClassName('questionTitle');
    var titles = document.getElementsByClassName('title');

    $(".questionTitle, .title")
        .unbind("click")
        // Change the questions so you get a different cursor when you hover
        .css({
            "cursor": "move"
        })
        // make questions draggable
        .attr("draggable", "true");
    
    $(".questions").sortable({
        connectWith: '.questions'
    });
    // Make it so that double clicking on a header title won't hide all questions
    $(".project").unbind("dblclick");

    // Remove the current 'go to' & 'delete' buttons
    $(".deleteIcon, .goToIcon").remove();

    // Save a list of the questions' ID values so we know their ordering
    questions = []; // reset the array of ID values
    var questionNum = 0 ; // init

    for (var i = 0; i < $(".questions").length; i++) {
        questions.push([]);
        for (var j = 0; j < $(".questions").eq(i).children().length; j++, questionNum++) {
            $(".question").eq(questionNum).attr('id', i + "," + j); // to make it easier, let's just assign it an integer
            questions[i].push([i, j]);
        }
    }
}

/*-------------------------------------------------------------------
********* SAVE EDITS TO PROJECTS
-------------------------------------------------------------------*/
function saveEdits() {
    // Show the edit button again & hide show button
    $("#edit").show(0);
    $("#saveEdits").hide(0);

    // Get the changed order of the questions
    var newOrder = []; // reset the array of ID values
    var questionNum = 0; // init
    for (var i = 0; i < $(".questions").length; i++) {
        newOrder.push([]);
        for (var j = 0; j < $(".questions").eq(i).children().length; j++, questionNum++) {
            var newQuestionIndex = $(".question").eq(questionNum).attr('id'); // to make it easier, let's just assign it an integer
            newOrder[i].push(newQuestionIndex);
        }
    }

    var newQuestions = [],
        dimensions,
        firstNum,
        secondNum;

    chrome.storage.local.get(null, function(item) {
        // Save each of the project headers
        for (var i = 1; i < $("input").length; i++) {
            item.projects[i].name = $("input").eq(i).val();
        }

        for (var i = 0; i < newOrder.length; i++) {
            newQuestions.push([]);

            for (var j = 0; j < newOrder[i].length; j++) {
                dimensions = newOrder[i][j].split(',');

                //get first number & last number
                firstNum = parseInt(dimensions[0]);
                secondNum = parseInt(dimensions[1]);

                var addObject = item.projects[firstNum].questions[secondNum];
                newQuestions[i].push(addObject);
            }
        }

        for (var i = 0; i < item.projects.length; i++) {
            item.projects[i].questions = newQuestions[i];
        }
        
        // Set the reordered projects...
        chrome.storage.local.set(item, function() {
            console.log("Your function names have successfully been changed.");
        });
    });

    $("input").disabled = true;
    // window.location.href = window.location.href; // refresh
}

/*-------------------------------------------------------------------
********* SAVE EDITS WHEN WINDOW CLOSES
-------------------------------------------------------------------*/
$(window).unload(function() {
    saveEdits();
});