Template.signup.events({
  'submit #signup-form': function (event, template) {
    event.preventDefault();
    Accounts.createUser({
      email: template.find('#signup-email').value,
      password: template.find('#signup-password').value
    }, function (error) {
      if (error) {
        console.log(error);
      };
    });
  }
});