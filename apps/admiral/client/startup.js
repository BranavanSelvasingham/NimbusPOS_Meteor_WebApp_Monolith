Meteor.startup(function() {
    Maestro.Client.startupHooks.forEach((customFunction) => { customFunction.apply(this, arguments);});    
});
