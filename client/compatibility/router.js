Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
	this.route('home', {
		path: '/',
		template: 'home'
	});

	this.route('article', {
		path: '/:_id',
		template: 'article'
	});
});