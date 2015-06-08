function addStarEventListeners(star) {
    star.addEventListener('click', function() {setDefault(index);});
    star.addEventListener('mouseenter', function() {
        var top = starIcons[index].getBoundingClientRect().top,
            left = starIcons[index].getBoundingClientRect().left,
            height = projectHeaders[index].offsetHeight,
            topOffset = 0;

        this.src = 'images/star-chosen.svg';

        var helperText = createHelperText("Make default project");
        helperText.style.left = left - 16 + "px";

        if (index !== 0) {
            addHelperTextRelativeToUnsorted(helperText);
        } else {
            helperText.style.top = top - topOffset - 21 + "px";
        }

        document.body.appendChild(helperText);
    });

    star.addEventListener('mouseleave', function() {
        this.src = 'images/star.svg';
        removeHelperText();
    });
}

function createStarIcon() {
    var star = document.createElement('img');
    star.src = 'images/star.svg';
    star.classList.add('star');

    return star;
}

function createHelperText(text) {
    var helperText = document.createElement('p');
    helperText.textContent = text;
    helperText.classList.add('helperText');

    helperText.addEventListener('mouseout', function() {
        removeHelperText();
    });

    return helperText;
}

function addHelperTextRelativeToUnsorted(helperText) {
    var unsortedEmptyIcon = document.getElementById("emptyUnsorted");
    topOffset = unsortedEmptyIcon.getBoundingClientRect().top;
    helperText.style.top = top - topOffset + height + 18 + "px";
}

function addStar(index) {
    var star = createStarIcon(),
        projectsToAddIcons = document.getElementsByClassName('addIcons');
    
    addStarEventListeners(star);
    projectsToAddIcons[index].appendChild(star);
}



function hoverChosenStar(currentDefault) {
    var unsortedEmptyIcon = document.getElementById("emptyUnsorted"),
        projectHeaders = document.getElementsByClassName('projectHeader'),
        top = starIcons[currentDefault].getBoundingClientRect().top,
        left = starIcons[currentDefault].getBoundingClientRect().left,
        height = projectHeaders[currentDefault].offsetHeight,
        topOffset = unsortedEmptyIcon.getBoundingClientRect().top;

    var helperText = createHelperText("This is the default project");
    helperText.style.top = top - topOffset + height + 18 + "px";
    helperText.style.left = left - 16 + "px";
    document.body.appendChild(helperText);
}



function setDefault(newDefault) {
    chrome.storage.local.get(null, function(item) {
        var prevDefault = item.settings.defaultProject;

        $(".star").remove();
        removeHelperText();
        for (var i = 0; i < projectsToAddIcons.length; i++) {
            addStar(i);
        }

        showDefaultProject();

        item.settings.defaultProject = newDefault;
        chrome.storage.local.set(item);
    });
}



function showDefaultProject() {
    chrome.storage.local.get(null, function(item) {
        var currentDefaultProject = item.settings.defaultProject,
            starIcons = document.getElementsByClassName('star');

        starIcons[currentDefaultProject].parentNode.removeChild(starIcons[currentDefaultProject]);

        var chosenStar = replaceStarWithFunctionlessStar(currentDefaultProject);

        projectsToAddIcons[currentDefaultProject].appendChild(chosenStar);
    });
}

function replaceStarWithFunctionlessStar() {
    var chosenStar = document.createElement('img'),
        projectsToAddIconsTo = document.getElementsByClassName('addIcons'),
        currentDefaultProject;


    chosenStar.src = 'images/star-chosen.svg';
    chosenStar.classList.add('star');


    chrome.storage.local.get(null, function(item) {
        currentDefaultProject = item.settings.defaultProject;
    });

    chosenStar.addEventListener('mouseenter', function() {hoverChosenStar(currentDefaultProject);}, false);
    chosenStar.addEventListener('mouseout', function() {removeHelperText();}, false);

    return chosenStar;
}
