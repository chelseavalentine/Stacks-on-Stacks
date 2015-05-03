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
      console.log(items);
    }
  });
}


$(window).ready(function(){
  
getLink();
console.log("Got that one link");

getAllLinks();
console.log("Now got all links");
 
})
