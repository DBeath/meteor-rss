google.load("feeds", "1");
var feedList = new Array();

function search(query){
	google.feeds.findFeeds(query, findDone);
}

function findDone(result){
	if (!result.error){
		for (var i = 0; i < result.entries.length; i++){
			feedList[i] = result.entries[i];
		}
	}
}