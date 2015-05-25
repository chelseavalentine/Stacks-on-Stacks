// in the content script, listen for Crtl+Q (upper or lowercase)
document.documentElement.addEventListener("keypress", function(e) {
    if((e.which == 81 || e.keyCode == 113) && e.ctrlKey) {
        window.location.href = "http://google.com";
    }
}, true);