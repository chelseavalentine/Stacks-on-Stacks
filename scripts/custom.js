function getLink(){
   return chrome.storage.local.get('value', function(items) {
    if(!chrome.runtime.error) {
      $("<p>" + items.value + "</p>").appendTo("body");
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
 
})
