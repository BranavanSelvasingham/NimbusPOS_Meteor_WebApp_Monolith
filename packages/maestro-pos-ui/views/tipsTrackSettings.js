Maestro.Templates.TipsTrackSettings = "TipsTrackSettings";

Template.TipsTrackSettings.onRendered(function () {
    
});

Template.TipsTrackSettings.helpers({
    trackTipsConfig: function(){
        let business = Businesses.findOne({_id: Maestro.Client.businessId()});
        if (business.configuration){
            if (business.configuration.trackTips){
                if (business.configuration.trackTips == true){
                    return "checked";
                }
            }
        }   
    }
});

Template.TipsTrackSettings.events({
    'click #enableTrackTips': function(event, target){
        let enableStatus = document.getElementById('enableTrackTips').checked;

        var business = Businesses.findOne({_id: Maestro.Client.businessId()});

        business.configuration.trackTips = enableStatus;

        Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
            }
        });
    }
});