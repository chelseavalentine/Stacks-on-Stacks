function checkIfInitialized() {
  chrome.storage.local.get('data', function(item) {
    if (Object.keys(item).length === 0) { // initialize storage
      chrome.storage.local.set({'data':[]}, function(){
        console.log('storage initialized');
      })
    }
    else { // storage exists
      getAllLinks();
      clear();
    }
  });
}


function deleteLink(link) {
  var found = false;
  chrome.storage.local.get(null, function(item) {
    for (var i = 0; i < item['data'].length; i++ ) {
      if (link === JSON.stringify(item['data'][i]['link'])) {
        // found object to delete from storage
        console.log(item['data']);
        item['data'].splice(i, 1);
        console.log(item['data']);
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
        var question =  JSON.stringify(items['data'][i]['question']);
        var answer = JSON.stringify(items['data'][i]['answer']);

        answer = answer.substring(1, answer.length-1) + "...";

        //check to see whether the question was cut to see whether we should add the ...
        if (question.length > 58) {
          question = question.substring(1, 60) + "...";
        } else {
          question = question.substring(1, question.length-1);
        }
        
        (function(i, link){
          $('<div class="question" id="question' + i +'"><div class="title"><p class="questionTitle">' + question + '</p><a target="_blank" href=' + link + '><img src="images/go.svg" class="icon"></a></div><div class="answer"><p class="answerText">' + answer + '</p></div></div>')
            .appendTo(document.getElementsByClassName('questions')[0]);
          $('<img src="/images/delete.svg" class="icon deleteIcon"></div>')
            .appendTo(document.getElementsByClassName('title')[i]).click(function() {
              var deleteTest;
          chrome.storage.local.get(null, function(item) { 
              $("#question" + i).remove();
              deleteLink(link);
            });
          });          
        })(i, link);
      }
    }
  });
}


$(function(){
  checkIfInitialized();
})

function clear() {
  $("#clearthis").click(function() {
  	chrome.storage.local.get(null, function(item) {
          item['data'].splice(0, item['data'].length);
          chrome.storage.local.set(item, function() {
            console.log('clear all');
          });
          
          });
  });
}


