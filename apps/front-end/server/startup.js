/*setupRoles = function() {
    var existingRoles = [];
    _.each(Roles.getAllRoles().fetch(), function(role){
        existingRoles.push(role.name);
    });

    var maestroRoles = [];
    for(var role in Maestro.roles){
        if(Maestro.roles.hasOwnProperty(role)) {
            maestroRoles.push(Maestro.roles[role]);
        }
    }

    var createRoles = _.reject(maestroRoles, function(role) {
        return _.contains(existingRoles, role);
    });

    _.each(createRoles, function(role) {
        Roles.createRole(role);
    });
};*/

Meteor.startup(function() {
    //setupRoles();

    // process.env.MAIL_URL = 'smtp://postmaster@sandboxe3550a273d68467ebf96218bd16c5d29.mailgun.org:55722a12879a2e830613ca179ebcf30f@smtp.mailgun.org:587';

    //Maestro.Scheduler.Initiate();
    
});


