'use strict';
chrome.extension.sendMessage({}, function(response) {

    $("body").attr("style", "padding: 0 !important");						
    
    var SeasonvarApp = new window.SeasonvarApp();

    $(document).ready(function(){
	    SeasonvarApp.init();
	    SeasonvarApp.addHistoryLink();
	    SeasonvarApp.addCheckboxListener();
	});
	
});