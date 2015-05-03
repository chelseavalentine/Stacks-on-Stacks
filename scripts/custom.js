function checkIfInitialized() {
  chrome.storage.local.get('data', function(item) {
    if (Object.keys(item).length === 0) { // initialize storage
      chrome.storage.local.set({'data':[]}, function(){
        console.log('storage initialized');
      })
    }
    else { // storage exists
      getAllLinks();
    }
  });
}

function deleteFirstLink() {
  chrome.storage.local.get(null, function(item) {

    var size = JSON.stringify(item['data']).length;//length of the collection
    // set condition here to check which one to delete
    var link = JSON.stringify(item['data'][0]['question']);
    item['data'].splice(0, 1);
    // console.log(JSON.stringify(item['data']));
    chrome.storage.local.set(item, function() {
      console.log('first item deleted: ' + link);
    });
  });
}

function deleteLink(link) {
  var found = false;
  chrome.storage.local.get(null, function(item) {
    for (var i = 0; i < item['data'].length; i++ ) {
      if (link === JSON.stringify(item['data'][i]['link'])) {
        // found object to delete from storage
        item['data'].splice(i, i+1);
        found = true;
        break;
      }
    }
    if (found) {
      chrome.storage.local.set(item, function() {
        console.log(link + ' deleted from storage');
      })
    }
    else {
      console.log(link + ' not found in storage');
    }
  });
}



function getAllLinks(){
  return chrome.storage.local.get(null, function(items) {
    if(!chrome.runtime.error) {
      for (var i = 0; i < items['data'].length; i++) {
        var link =  JSON.stringify(items['data'][i]['link']);
        // var newLink = link.substring(1, link.length-1);

        var question =  JSON.stringify(items['data'][i]['question']);
        var newQuestion = question.substring(1, 36) + "...";

        var divQuestion = document.createElement("div");
        divQuestion.className = "question";
        
        var divTitle = document.createElement("div");
        divTitle.className = "title";

        var questionTitle = document.createElement("p");
        questionTitle.className = "questionTitle";
        questionTitle.appendChild(document.createTextNode(newQuestion));

        divTitle.appendChild(questionTitle);

        var divAnswer = document.createElement("div");
        divAnswer.className = "answer";
        var answer = document.createElement("p");
        answer.appendChild(document.createTextNode("Stop time. Learn X in 10 years, and then resume time."));
        answer.className = "answerText";
        divAnswer.appendChild(answer);

        divQuestion.appendChild(divTitle);
        divQuestion.appendChild(divAnswer);
        document.getElementById("myBase").href = "chrome-extension://gfifjnamhobmppodbibkpkhjkkpebgjf";
        document.getElementsByClassName('questions')[0].appendChild(divQuestion);


        var deleteIcon = document.createElement("img");
        deleteIcon.setAttribute("src", "/images/delete.svg");
        deleteIcon.className = "delete";
        deleteIcon.setAttribute("onclick", "fucker()");

        divTitle.appendChild(deleteIcon);

        $( '<a href=' + link + ' target="_blank"><img src="/images/go.svg" class="icon"></a>').appendTo(document.getElementsByClassName('title')[i]);
      }
    }
  });
}



$(".title").click(function() {
  alert("clicked");
  var currentURL = window.location.href.toString();
  if (!(currentURL.indexOf("stackoverflow") >= 0)) {
    $(this).next().toggle(0);
  }
})



$(window).ready(function(){
  checkIfInitialized();
    // checking delete
  // var deleteTest;
  // chrome.storage.local.get(null, function(item) { 
  //   deleteTest = JSON.stringify(item['data'][0]['link']);
  //   console.log(deleteTest);
  //   deleteLink(deleteTest);
  // });
})

//Style javascript
$(document).click(function() {
  var currentURL = window.location.href.toString();
  if (!(currentURL.indexOf("stackoverflow") >= 0)) {

  }    
})

