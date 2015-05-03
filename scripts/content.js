// content.js
// GET CURRENT URL
var firstHref = window.location.href;

console.log(firstHref);
var title = document.getElementById('question-header').textContent;
console.log(title);
saveLink(firstHref);

function saveLink(link){
  chrome.storage.local.set({'value': link}, function() {
    // tell me if saved
    console.log('link saved');
  });
}


// TEST INDEXEDDB
var openRequest = window.indexedDB.open('test', 1);


chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});