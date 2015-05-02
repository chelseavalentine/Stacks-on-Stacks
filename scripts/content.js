// content.js
// GET CURRENT URL
var firstHref = window.location.href;
var title = document.getElementById('question-header').textContent;

console.log(firstHref);
console.log(title);

function saveLink(link){
  chrome.storage.local.set({'value': link}, function() {
    // tell me if saved
    console.log('link saved');
  });
}

function getLink(){
 return chrome.storage.local.get('value', function(items) {
  if(!chrome.runtime.error) {
    console.log(items);
  }
 });
}

function getAllLinks(){
  return chrome.storage.local.get('value', function(items) {
    if(!chrome.runtime.error) {
      console.log(items);
    }
  });
}

// TEST INDEXEDDB
var openRequest = window.indexedDB.open('test', 1);



chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});

// saveLink(firstHref);
//getAllLinks();
// getLink();