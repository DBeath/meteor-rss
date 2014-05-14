Template.login.events({
  'submit #login-form': function (event, template) {
    event.preventDefault();
    var email = template.find('#login-email').value;
    var password = template.find('#login-password').value;
    Meteor.loginWithPassword(email, password, function (error) {
      if (error) {
        $("#notify").val(error);
      };
      Router.go('/');
    });
  }
});

Template.logout.events({
  'click #logout': function () {
    console.log('logging out user');
    Meteor.logout(function () {
      console.log('logged out');
    });
  }
});