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
        // var newLink = link.substring(1, link.length-1);

        var question =  JSON.stringify(items['data'][i]['question']);
        var newQuestion = question.substring(1, 30) + "...";


        
        (function(i, link){
          $('<div class="question" id="question' + i +'"><div class="title"><p class="questionTitle">' + newQuestion + '</p><a target="_blank" href=' + link + '><img src="images/go.svg" class="icon"></a></div></div>').appendTo(document.getElementsByClassName('questions')[0]);
          $('<img src="/images/delete.svg" class="icon deleteIcon"></div>').appendTo(document.getElementsByClassName('title')[i]).click(function() {
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


