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
        item['data'].splice(i, 1);
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

$("")


function getAllLinks(){
  return chrome.storage.local.get(null, function(items) {
    if(!chrome.runtime.error) {
      for (var i = 0; i < items['data'].length; i++) {
        var link =  JSON.stringify(items['data'][i]['link']);
        // var newLink = link.substring(1, link.length-1);

        var question =  JSON.stringify(items['data'][i]['question']);
        var newQuestion = question.substring(1, 30) + "...";


        var thing = $('<div class="question" id="question' + i +'"><div class="title"><p class="questionTitle">' + newQuestion + '</p><a href="' + link + '"><img src="images/go.svg" class="icon"></a></div></div>').appendTo(document.getElementsByClassName('questions')[0]);
        
        (function(i, thing){
          $('<img src="/images/delete.svg" class="icon deleteIcon"></div>').appendTo(document.getElementsByClassName('title')[i]).click(function() {
            var deleteTest;
            chrome.storage.local.get(null, function(item) { 
              deleteTest = JSON.stringify(item['data'][i]['link']);
              console.log(deleteTest);
              deleteLink(deleteTest);
              $("#question" + i).remove();
            });
            alert("hi");

          });          
        })(i, thing);

      }
    }
  });
}

// $(".title").click(function() {
//   alert("clicked");
//   var currentURL = window.location.href.toString();
//   if (!(currentURL.indexOf("stackoverflow") >= 0)) {
//     $(this).next().toggle(0);
//   }
// })

$(function(){
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

