Maestro.Client.goToUserHome = function(){
    BlazeLayout.render("Layout", {content: Maestro.Templates.Home});
};

// FlowRouter.triggers.enter([loggedIn], {except: [Maestro.route.Root, Maestro.route.Login, Maestro.route.Signup]});

// Maestro.Users.onLoginFailure(redirectToLogin);

// Maestro.Users.onLogout(redirectToLogin);

FlowRouter.notFound = {
    action: function () {
        FlowRouter.go(Maestro.route.Home);
    }
};