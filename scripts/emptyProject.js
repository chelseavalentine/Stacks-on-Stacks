function addUnsortedEmpty(projectIndex) {
    var emptyUnsortedIcon = createUnsortedsEmptyIcon();
    emptyUnsortedIcon.id = 'emptyUnsorted';

    projectsToAddIcons[projectIndex].appendChild(emptyIcon);
    addEmptyIconEventListeners(projectIndex);
}

function createEmptyIcon() {
    var emptyIcon = document.createElement('img');
    emptyIcon.src = 'images/empty.svg';
    emptyIcon.classList.add('empty');
    
    return emptyIcon;
}

function addEmptyIconEventListeners(projectIndex) {
    emptyUnsortedIcon.addEventListener('mouseenter', function() { changeEmptyIconUponHover(projectIndex); }, false);
    emptyUnsortedIcon.addEventListener('mouseout', function() { restoreEmptyIconOffHover(projectIndex); }, false);
    emptyUnsortedIcon.addEventListener('click', function() { emptyProject(projectIndex); }, false);
}

function addEmpty(projectIndex) {
    var emptyIcon = createEmptyIcon();
    projectsToAddIcons[projectIndex].appendChild(emptyIcon);
    addEmptyIconEventListeners(projectIndex);
}

function changeEmptyIconUponHover(projectIndex) {
    var emptyIcons = document.getElementsByClassName('empty'),
        projectHeaders = document.getElementsByClassName('projectHeader'),
        top = emptyIcons[projectIndex].getBoundingClientRect().top,
        unsortedsEmptyIcon = document.getElementById("emptyUnsorted"),
        left = emptyIcons[projectIndex].getBoundingClientRect().left,
        height = projectHeaders[0].offsetHeight;
        topOffset = 0;

    emptyIcons[projectIndex].src = 'images/empty-hover.svg';

    var helperText = createHelperText("Delete project");
    helperText.style.left = left - 4 + "px";

    if (projectIndex !== 0) {
        topOffset = unsortedsEmptyIcon.getBoundingClientRect().top;
        helperText.style.top = top - topOffset + height + 16 + "px";
    } else {
        helperText.textContent = 'Empty this project';
        helperText.style.top = top - topOffset - 23 + "px";
    }

    document.body.appendChild(helperText);
}

function restoreEmptyIconOffHover(projectIndex) {
    emptyIcons[projectIndex].src = 'images/empty.svg';
    removeHelperText();
}




function emptyProject(projectIndex) {
    chrome.storage.local.get(null, function(item) {
        var projectName = item.projects[projectIndex].name,
        var coverup = document.createElement('div'); // A dark black semi-opaque background that goes behind modal
        coverup.classList.add('cover');

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

            if (projectIndex === 0) {
                var numQuestions = item.projects[0].questions.length;

                //Clear all of the questions
                item.projects[0].questions.splice(0, numQuestions);
                questions[0].innerHTML = '';

                chrome.storage.local.set(item);
            } else {
                // Delete the project
                item.projects.splice(projectIndex, 1);

                chrome.storage.local.set(item);

                // Visually delete the project from view & recolor headers
                var ourProjects = document.getElementsByClassName('project');
                ourProjects[projectIndex].parentNode.removeChild(ourProjects[projectIndex]);
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
