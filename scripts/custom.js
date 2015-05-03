function checkIfInitialized() {
  chrome.storage.local.get('data', function(item) {
    if (Object.keys(item).length === 0) { // initialize storage
      chrome.storage.local.set({'data':[]}, function(){
        console.log('storage initialized');
      })
    }
    else { // storage exists
      getLink();
    }
  });
}

function deleteFirstLink() {
  chrome.storage.local.get(null, function(item) {
    // set condition here to check which one to delete
    console.log(JSON.stringify(item['data']));
    var link = JSON.stringify(item['data'][0]['question']);
    item['data'].splice(0, 1);
    console.log(JSON.stringify(item['data']));
    chrome.storage.local.set(item, function() {
      console.log('first item deleted: ' + link);
    });
  });
}

function getLink(){
   return chrome.storage.local.get('value', function(items) {
    if(!chrome.runtime.error) {
      $("<a href='" + items.value + "' target='_blank'><p>" + items.value + "</p></a>").appendTo("body");
       console.log(items);
    }
   });
}

function getAllLinks(){
  return chrome.storage.local.get('value', function(items) {
    if(!chrome.runtime.error) {
      console.log("multiple" + items);
    }
  });
}


$(window).ready(function(){
  checkIfInitialized();
  // checking delete
  deleteFirstLink();

getLink();
console.log("Got that one link");

getAllLinks();
console.log("Now got all links");
 
})

//Style javascript
$(document).click(function() {
  var currentURL = window.location.href.toString();
  if (!(currentURL.indexOf("stackoverflow") >= 0)) {
  }    
})

