function addUnsortedEmpty(projectIndex) {
    var emptyUnsortedIcon = createEmptyIcon();
    emptyUnsortedIcon.id = 'emptyUnsorted';

    projectsToAddIcons[projectIndex].appendChild(emptyUnsortedIcon);
    addEmptyIconEventListeners(emptyUnsortedIcon, projectIndex);
}

function createEmptyIcon() {
    var emptyIcon = document.createElement('img');
    emptyIcon.src = 'images/empty.svg';
    emptyIcon.classList.add('empty');
    
    return emptyIcon;
}

function addEmptyIconEventListeners(icon, projectIndex) {
    icon.addEventListener('mouseenter', function() { changeEmptyIconUponHover(projectIndex); }, false);
    icon.addEventListener('mouseout', function() { restoreEmptyIconOffHover(projectIndex); }, false);
    icon.addEventListener('click', function() { emptyProject(projectIndex); }, false);
}

function addEmpty(projectIndex) {
    var emptyIcon = createEmptyIcon(),
        projectsToAddIcons = document.getElementsByClassName('addIcons');
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
        var projectName = item.projects[projectIndex].name;
        
        addDarkScreen();
        createModal("Are you sure that you want to delete <i>" + projectName + "</i>?");
        addDeleteOption(projectIndex);
        addKeepOption();    
    });
}

function addDarkScreen() {
    var darkScreen = document.createElement('div');
    darkScreen.classList.add('cover');
    document.body.appendChild(darkScreen);
}

function createModal(message) {
    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = '<p><center id="modalCenter">' + message + '<br><br></center></p>';
    document.body.appendChild(modal);
}

function addDeleteOption(projectIndex) {
    var deleteButton = document.createElement('button'),
        modalCenter = document.getElementById('modalCenter');
    deleteButton.classList.add('confirmProjectDelete', 'flatButton');
    deleteButton.innerHTML = 'DELETE';

    deleteButton.addEventListener('click', function() {
        removeModalAndDarkScreen();

        if (projectIndex === 0) {
            clearProjectQuestions();
        } else {
            deleteProject(projectIndex);
        }
    });

    modalCenter.appendChild(deleteButton);
}

function removeModalAndDarkScreen() {
    var darkScreen = document.getElementsByClassName('cover')[0],
        modal = document.getElementsByClassName('modal')[0];

    darkScreen.parentNode.removeChild(darkScreen);
    modal.parentNode.removeChild(modal);
}

function clearProjectQuestions() {
    var questions = document.getElementsByClassName('questions'),
        numberOfQuestions;

    chrome.storage.local.get(null, function(item) {
        numberOfQuestions = item.projects[0].questions.length;
        item.projects[0].questions.splice(0, numberOfQuestions);
        questions.innerHTML = '';

        chrome.storage.local.set(item);
    });
}

function deleteProject(projectIndex) {
    chrome.storage.local.get(null, function(item) {
        item.projects.splice(projectIndex, 1);

        chrome.storage.local.set(item);
        deleteProjectVisually(projectIndex);
    });
}

function deleteProjectVisually(projectIndex) {
    var projects = document.getElementsByClassName('project');
    projects[projectIndex].parentNode.removeChild(projects[projectIndex]);
    colorHeaders();

    window.location.href = window.location.href;
}

function addKeepOption() {
    var keepButton = document.createElement('button'),
        modalCenter = document.getElementById('modalCenter');

    keepButton.classList.add('confirmKeep', 'flatButton');
    keepButton.innerHTML = 'NO';
    keepButton.addEventListener("click", function () {
        removeModalAndDarkScreen();
    });

    modalCenter.appendChild(keepButton);
}
