(function( global, $ ) {

	var SeasonvarApp = (function(){

		var userName = getUser();
		var serialsTableName = "serials";
    	var serialsTableFields = {'serialName': '', 'userName': '', 'lastSeen': ''};
    	var WebDB = new global.WebDB("seasonvar", "DB for seasonvarExtension", userName, 1024*1024, '1.2');

    	function highlightItems (r) {
			for (var i = 0; i < r.length; i++) {
	            var $item = $(".film-list-item-link:contains('"+r.item(i).serialName+"')");
	            $item.parent().addClass('highlight');
				$item.prev("input").attr("checked", true);
				// $item.before('<img src="' + chrome.extension.getURL('src/img/seasonvar_eye.png') + '"/>');
			}
		};

		function highlightByName (name) {
	        var $item = $(".film-list-item-link:contains('"+name+"')");
			$item.parent().addClass('highlight');
			$item.prev("input").attr("checked", true);
		};

		function unhighlightByName (name) {
	        var $item = $(".film-list-item-link:contains('"+name+"')");
	        $item.parent().removeClass('highlight');
			$item.prev("input").attr("checked", false);
		};

		function getUser () {
			var userName = $('.top-link.login div').text().replace('⇓','');
			return userName != "" ? userName : "anonymous";
		};

		return {
			init: function () {
				$(".film-list-item-link").before("<input type='checkbox'/>");
				WebDB.open();
		        WebDB.createTableIfNotExists(serialsTableName, serialsTableFields);
				WebDB.getAllItemsBy(serialsTableName, 'userName', userName, highlightItems);
				
				$.ajax({
					url : 'http://seasonvar.ru/?mod=history',
					method : 'GET',
					success : function(result) {
						var lastWatched = $(result).find("#history").children("a").first();
						lastWatched.find("div").remove();
						lastWatched.addClass("top-link");
						$(".top-link").last().after(lastWatched);
					}
				});
			},
			addHistoryLink: function () {
				var historyLink = document.createElement("a");
				historyLink.href="http://seasonvar.ru/?mod=history";
				historyLink.innerText="История";
				historyLink.className="top-link";
				$(".top-link").last().after(historyLink);
			},
			addCheckboxListener: function () {
				$(".film-list-item").on("change", "input[type='checkbox']", function(){
			        var $self = $(this);
			        var serialName = $self.next(".film-list-item-link").text().trim()
					if ($self.is(":checked")) {
						WebDB.insertItem(
			                serialsTableName,
			                {'serialName': serialName, 'userName': userName},
			                highlightByName(serialName)
			            );
					}else{
						WebDB.deleteItem(
			                serialsTableName,
			                {'serialName': serialName, 'userName': userName},
			                unhighlightByName(serialName)
			            );
					}

				});
			}
		}
	});

	global.SeasonvarApp = SeasonvarApp;

})(window, jQuery);