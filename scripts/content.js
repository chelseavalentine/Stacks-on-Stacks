// content.js
// GET CURRENT URL
var currentURL = window.location.href;
var title = document.getElementById('question-header').textContent;

saveLink(title, currentURL);

function saveLink(question, link){
  chrome.storage.local.set({'question': question, 'url': link}, function() {
    // tell me if saved
    console.log('link saved: ' + question);
  });
}
