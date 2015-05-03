// content.js
// GET CURRENT URL
var currentURL = window.location.href;
var title = document.getElementById('question-header').textContent;

console.log(currentURL);
console.log(title);

saveLink(title, currentURL);


function saveLink(question, link){
	// prettify question by taking out whitespaces, tabs, and null
	question = question.split(/\s+/).filter(function(e){return e===0 || e}).join(' ');
  	
  	// check for duplicates
  obj = {'question': question, 'link': link};
  chrome.storage.local.get(null, function(item) {
    var isDup = false;
    var a;
    for(var i=0; i<Object.keys(item['data']).length; i++) {
      if (item['data'][i]['link'] === obj['link']) {
        isDup = true;
        break;
      }
    };
    if (!isDup) {
      item['data'].push(obj);
      chrome.storage.local.set(item, function(){
        console.log('obj set: '+ obj);
      });
    }
    else {
      console.log('already exists in storage');
    }
  });
}