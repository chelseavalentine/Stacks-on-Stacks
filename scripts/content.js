// content.js
// GET CURRENT URL
var currentURL = window.location.href;
var title = document.getElementById('question-header').textContent;
var firstAnswer = document.getElementsByClassName('answercell')[0].textContent;

var content = firstAnswer.split('share|improve this answer');
firstAnswer = content[0];
console.log("first answer is ");
console.log(firstAnswer);


saveLink(currentURL, title, firstAnswer);


function saveLink(link, question, answer) {
	// prettify question & answer by taking out whitespaces, tabs, and null
	question = question.split(/\s+/).filter(function(e){return e===0 || e}).join(' ');
  answer = answer.replace(/\r?\n/g, '<br />').substring(16, 450);

  // check for duplicates
  obj = {'link': link, 'question': question, 'answer': answer};
  chrome.storage.local.get(null, function(item) {
    var isDup = false;

    for(var i=0; i<Object.keys(item['data']).length; i++) {
      if (item['data'][i]['link'] === obj['link']) {
        isDup = true;
        break;
      }
    }

    if (!isDup) {
      item['data'].push(obj);
      chrome.storage.local.set(item, function(){
        console.log("");
      });
    }
    else {
      console.log('already exists in storage');
    }
  });
}


// Project formation

// var newName = document.getElementById('newproject').textContent;
//   // Saving a new project
//   function saveNewProject (newName) {
//       //add new project header
//       // var newName = $("#newproject").val();
      
//       console.log(newName);
//       var newProject = {'name': newName};

//       chrome.storage.local.get(null, function(item) {
//         item['projects'].push(newProject);
//       })
//   }

//   saveNewProject(newName);