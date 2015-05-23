/*===================================================================
***** SETTING AND VIEWING THE DEFAULT PROJECT
===================================================================*/

/*-------------------------------------------------------------------
********* ADD STARS TO SET/SHOW DEFAULT PROJECT
-------------------------------------------------------------------*/
function addStar(index) {
    // Create the star icon
    var star = document.createElement('img');
    star.src = 'images/star.svg';
    star.classList.add('star');

    // Add the events to the star
    star.addEventListener('click', function() {setDefault(index);}); // click
    star.addEventListener('mouseenter', function() {
        this.src = 'images/star-chosen.svg'; // change to filled in star

        // get position of empty icon so we can position helper text
        var top = starIcons[index].getBoundingClientRect().top; // get the star's offset from the top
        var left = starIcons[index].getBoundingClientRect().left; // get the star's offset from the left

        var height = projectHeaders[index].offsetHeight; // get height of project header
        var topOffset = 0;

        // Create helper text
        var helperText = document.createElement('p');
        helperText.textContent = "Make default project";
        helperText.classList.add('helperText');
        helperText.style.left = left - 16 + "px";

        if (index !== 0) {
            // get X pos of emptyUnsorted icon to position helper texts relative to that
            topOffset = unsortedEmptyIcon.getBoundingClientRect().top;

            // Position helper text            
            helperText.style.top = top - topOffset + height + 18 + "px";
        } else {
            helperText.style.top = top - topOffset - 21 + "px";
        }
        document.body.appendChild(helperText);
    });
    star.addEventListener('mouseleave', function() {
        this.src = 'images/star.svg';
        removeHelperText();
    });

    // Add the star to the project header
    projectsToAddIcons[index].appendChild(star);
}


/*-------------------------------------------------------------------
********* SHOW NEW DEFAULT CHOICE: Upon hovering over star
Display helper text to indicate the action that'll occur upon click
-------------------------------------------------------------------*/
function hoverChosenStar(currentDefault) {
    // Initialize variables
    var unsortedEmptyIcon = document.getElementById("emptyUnsorted");
    var top = starIcons[currentDefault].getBoundingClientRect().top; // get the star's offset from the top
    var left = starIcons[currentDefault].getBoundingClientRect().left; // get the star's offset from the left

    var height = projectHeaders[currentDefault].offsetHeight;
    var topOffset = unsortedEmptyIcon.getBoundingClientRect().top; // get the Unsorted empty icon's offset from the top

    // Create and style helper text, before adding it to the page
    var helperText = document.createElement('p');
    helperText.textContent = "This is the default project";
    helperText.classList.add('helperText');
    helperText.style.top = top - topOffset + height + 18 + "px";
    helperText.style.left = left - 16 + "px";
    document.body.appendChild(helperText);
}


/*-------------------------------------------------------------------
********* SET DEFAULT PROJECT
Change the project that links are automatically added to.
-------------------------------------------------------------------*/
function setDefault(newDefault) {
    chrome.storage.local.get(null, function(item) {
        // Hold on to the previous default project
        var prevDefault = item.settings.defaultProject;

        // Replace the star of the previous default so that things happen when you hover, click, etc.
        $(".star").remove();
        removeHelperText();
        for (var i = 0; i < projectsToAddIcons.length; i++) {
            addStar(i);
        }

        showDefaultProject();

        // Change the current default project to the user selection
        item.settings.defaultProject = newDefault;
        chrome.storage.local.set(item);
    }); 
}

/*-------------------------------------------------------------------
********* SHOW NEW DEFAULT CHOICE [MAIN]
-------------------------------------------------------------------*/
function showDefaultProject() {
    chrome.storage.local.get(null, function(item) {
        // get index of current default project
        var currentDefault = item.settings.defaultProject;

        // remove the current star of the current project
        starIcons[currentDefault].parentNode.removeChild(starIcons[currentDefault]);

        /////////////// REPLACE IT WITH A FUNCTIONLESS STAR
        // create the functionless star to be added to the body
        var chosenStar = document.createElement('img');
        chosenStar.src = 'images/star-chosen.svg';
        chosenStar.classList.add('star');

        // Set activities that'll occur upon user hover
        chosenStar.addEventListener('mouseenter', function() {hoverChosenStar(currentDefault);}, false);
        chosenStar.addEventListener('mouseout', function() {removeHelperText();}, false);

        // Add star to the body
        projectsToAddIcons[currentDefault].appendChild(chosenStar);
    });
}
