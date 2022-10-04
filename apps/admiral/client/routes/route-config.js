
Maestro.Client.goToUserHome = function(){
    BlazeLayout.render("Layout", {content: Maestro.Templates.Home});
};

FlowRouter.notFound = {
    action: function () {
        FlowRouter.go(Maestro.route.Home);
    }
};