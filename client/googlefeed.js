$.get('https://www.google.com/jsapi', function(response){
	google.load("feeds", "1");
});

var search = function(query){
	var feedList = new Array();
	google.feeds.findFeeds(query, findDone(feedList));
	return feedList;
};

function findDone(result, feedList){
	if (!result.error){
		for (var i = 0; i < result.entries.length; i++){
			feedList[i] = result.entries[i];
		}
	}
};