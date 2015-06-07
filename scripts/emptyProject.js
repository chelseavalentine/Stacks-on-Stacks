/*-------------------------------------------------------------------
********* ADD 'UNSORTED' EMPTY ICON
-------------------------------------------------------------------*/
function addUnsortedEmpty(projectPos) {
    // Create unsorted's empty icons & add it to the 'Unsorted' project header
    var emptyUnsortedIcon = document.createElement('img');
    emptyUnsortedIcon.src = 'images/empty.svg';
    emptyUnsortedIcon.classList.add('empty');
    emptyUnsortedIcon.id = 'emptyUnsorted';
    projectsToAddIcons[projectPos].appendChild(emptyUnsortedIcon);

    // Set activities that'll occur upon user hover & click
    emptyUnsortedIcon.addEventListener('mouseenter', function() { changeEmptyIconStart(projectPos); }, false);
    emptyUnsortedIcon.addEventListener('mouseout', function() { changeEmptyIconEnd(projectPos); }, false);
    emptyUnsortedIcon.addEventListener('click', function() { emptyProject(projectPos); }, false);
}

/*-------------------------------------------------------------------
********* ADD EMPTY ICON
-------------------------------------------------------------------*/
function addEmpty(projectPos) {
    // Create unsorted's empty icons & add it to the 'Unsorted' project header
    var emptyIcon = document.createElement('img');
    emptyIcon.src = 'images/empty.svg';
    emptyIcon.classList.add('empty');
    projectsToAddIcons[projectPos].appendChild(emptyIcon);

    // Set activities that'll occur upon user hover & click
    emptyIcon.addEventListener('mouseenter', function() { changeEmptyIconStart(projectPos); }, false);
    emptyIcon.addEventListener('mouseout', function() { changeEmptyIconEnd(projectPos); }, false);
    emptyIcon.addEventListener('click', function() { emptyProject(projectPos); }, false);
}

/*-------------------------------------------------------------------
********* Empty icon: Upon hover
When you hover over an empty icon, change the image to the black 'x'
-------------------------------------------------------------------*/
function changeEmptyIconStart(projectPos) {
    emptyIcons[projectPos].src = 'images/empty-hover.svg'; // change to black 'x'

    // Initialize variables
    var top = emptyIcons[projectPos].getBoundingClientRect().top;
    var left = emptyIcons[projectPos].getBoundingClientRect().left;
    
    var height = projectHeaders[0].offsetHeight; // Get the height of a projectHeader
    var topOffset = 0;

    // Create helper text
    var helperText = document.createElement('p');
    helperText.classList.add('helperText');
    helperText.style.left = left - 4 + "px";
    helperText.textContent = 'Delete project';

    if (projectPos !== 0) {
        var unsortedEmptyIcon = document.getElementById("emptyUnsorted");
        topOffset = unsortedEmptyIcon.getBoundingClientRect().top; // get the Unsorted empty icon's offset from the top

        // Position helper text
        helperText.style.top = top - topOffset + height + 16 + "px";
    } else {
        // Edit helper text before adding it to the page
        helperText.textContent = 'Empty this project';
        helperText.style.top = top - topOffset - 23 + "px";
    }

    document.body.appendChild(helperText);
}

/*-------------------------------------------------------------------
********* Empty icon: After hover
When you stop hovering over the empty icon, image is a white 'x'
-------------------------------------------------------------------*/
function changeEmptyIconEnd(projectPos) {
    emptyIcons[projectPos].src = 'images/empty.svg';
    removeHelperText();
}



/*-------------------------------------------------------------------
********* EMPTY/DELETE A PROJECT
If the project is the 'Unsorted' project, clear the links. If it is 
any other project, then delete the project entirely.
-------------------------------------------------------------------*/
function emptyProject(projectPos) {
    // Confirm deletion
    chrome.storage.local.get(null, function(item) {
        var projectName = item.projects[projectPos].name;

        // Partially conceal the extension w/ a dark background
        document.body.appendChild(coverup);

        // Add modal asking for deletion confirmation
        var modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = '<p><center id="modalCenter">Are you sure you want to delete <i>' + projectName + '</i>?<br><br></center></p>';
        document.body.appendChild(modal);

        var modals = document.getElementsByClassName('modal')[0];
        var deleteButton = document.createElement('button');
        deleteButton.classList.add('confirmProjectDelete', 'flatButton');
        deleteButton.innerHTML = 'DELETE';
        deleteButton.addEventListener("click", function () {
            coverup.parentNode.removeChild(coverup);
            modals.parentNode.removeChild(modals);

            //Change behavior depending on whether this is the 'Unsorted' project
            var questions = document.getElementsByClassName('questions');

            if (projectPos === 0) {
                var numQuestions = item.projects[0].questions.length;

                //Clear all of the questions
                item.projects[0].questions.splice(0, numQuestions);
                questions[0].innerHTML = '';

                chrome.storage.local.set(item);
            } else {
                // Delete the project
                item.projects.splice(projectPos, 1);

                chrome.storage.local.set(item);

                // Visually delete the project from view & recolor headers
                var ourProjects = document.getElementsByClassName('project');
                ourProjects[projectPos].parentNode.removeChild(ourProjects[projectPos]);
                colorHeaders();

                window.location.href = window.location.href; // refresh the page
            }
        });
        modalCenter = document.getElementById('modalCenter');
        modalCenter.appendChild(deleteButton);

        var keepButton = document.createElement('button');
        keepButton.classList.add('confirmKeep', 'flatButton');
        keepButton.innerHTML = 'NO';
        keepButton.addEventListener("click", function () {
            coverup.parentNode.removeChild(coverup);
            modals.parentNode.removeChild(modals);
        });
        modalCenter.appendChild(keepButton);
    });
}
