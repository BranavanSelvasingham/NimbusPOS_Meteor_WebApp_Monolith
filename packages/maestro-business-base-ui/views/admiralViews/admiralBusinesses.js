Maestro.Templates.AdmiralBusinesses = "AdmiralBusinesses";

var createMode = new ReactiveVar();
createMode.set(false);

var businessList = new ReactiveVar();

Template.AdmiralBusinesses.onRendered(function(){
	Meteor.call('getFullBusinessList', function(error, result){
		if(error){
			console.log(error);
		} else {
			businessList.set(result);
		}
	});
});

Template.AdmiralBusinesses.helpers({
	'blur #business-name': function(event, template) {
        Meteor.call("businessExists", template.find("#business-name").value, function(error, result) {
            Maestro.Client.toggleValidationClass("#business-name", (error || !result));
        });
    },
    businesses: function() {
        return Businesses.find({});
    },
    getBusinessUser: function(){
    	return BusinessUsers.findOne({_id: Meteor.user().profile.businessUserId});
    },
    inCreateBusinessMode: function(){
    	return createMode.get();
    },
    businessesList: function(){
    	return businessList.get();
    }
});

Template.AdmiralBusinesses.events({
	'click .createNewBusiness': function(event, target){
		createMode.set(true);
	},
    'click #cancel-create-business': function(event, target){
        createMode.set(false);
    },
	'submit #create-business': function(event, template) {
        event.preventDefault();

        let businessName = template.find("#business-name").value;

        let business = {
            name: businessName
        };

        Meteor.call("createBusinessAccount", business, function (error, result) {
            if (error) {
                Materialize.toast("Business creation failed. Try Again!", 4000, "rounded red");

                console.log(error);
                template.loading.set(false);
            } else {
                Materialize.toast("Business successfully created.", 4000, "rounded green");
                console.log('business created: ', result);
            }
        });
    },

    'click .selectBusiness': function(event, target){
    	let business = this;
    	let businessId = this._id;
    	// let businessName = this.name;

    	Meteor.call("selectBusinessSession", businessId, function(error){
    		if (error){
    			console.log(error);
    		} else {
    			Maestro.Client.selectBusiness(business);
    			// UserSession.set(Maestro.UserSessionConstants.BUSINESS_ID, businessId);
    			// UserSession.set(Maestro.UserSessionConstants.BUSINESS_NAME, businessName);
                Maestro.Client.selectLocation({_id: null, name: null});
    			FlowRouter.go(Maestro.route.Business);
    			console.log(Meteor.user());
    			location.reload();
    		}
    	})
    }

});