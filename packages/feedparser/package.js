Package.describe({
	summary: "Reads RSS feeds"
});
Npm.depends({feedparser: "0.16.1"});

Package.on_use(function(api){
	api.add_files('feedparser.js', 'server');
	if(api.export)
		api.export('Feedparser');
});