//If you click a question's title, the best answer will be shown


//If you click a project's title, the questions are hidden
$(".projectHeader").click(function() {
   	$(this).next().toggle(0);
})


//Background colors available
var bgcolors = ['#00bcd4', '#ff436c', '#8bc34a', '#ff9800'];

$(document).ready(function() {
	var currentURL = window.location.href.toString();
	if (!(currentURL.indexOf("stackoverflow") >= 0)) {
		var projectheaders = $(".projectHeader");
		for (var i = 0; i < projectheaders.length; i++) {
			$(".projectHeader").eq(i).css({
				"background-color": bgcolors[i%bgcolors.length]
			})
		}
	}
})