// content.js

var firstHref = window.location.href;
console.log(firstHref);

function saveLink(link){
  chrome.storage.sync.set({'value': link}, function() {
    // tell me if saved
    console.log('link saved');
  });
}

function getLink(){
 return chrome.storage.sync.get('value', function(items) {
  if(!chrome.runtime.error) {
    console.log(items);
  }
 });
}

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);

});

// saveLink(firstHref);
// getLink();



