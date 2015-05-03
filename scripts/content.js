// content.js
// GET CURRENT URL
var currentURL = window.location.href;
var title = document.getElementById('question-header').textContent;

console.log(currentURL);
console.log(title);

saveLink(title, currentURL);

// function saveLink(question, link){
//   chrome.storage.local.set({'question': question, 'url': link}, function() {
//     // tell me if saved
//     console.log('link saved: ' + question);
//   });
// }

function saveLink(question, link){
  obj = {'question': question, 'link': link};
  chrome.storage.local.get(null, function(item) {
    console.log(item['data']);
    item['data'].push(obj);
    chrome.storage.local.set(item, function(){
      console.log('obj set: '+ obj);
    });
  });
}