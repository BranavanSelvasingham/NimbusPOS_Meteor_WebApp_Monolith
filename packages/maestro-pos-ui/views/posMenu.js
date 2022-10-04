Maestro.Templates.POSMenu = "POSMenu";

Template.POSMenu.onCreated(function() {
	var template = this;

	template.showGeneralMenu = new ReactiveVar();
	template.showGeneralMenu.set(true);

	template.showAdminMenu = new ReactiveVar();
	template.showAdminMenu.set(false);
});

Template.POSMenu.onRendered(function() {

});

Template.POSMenu.helpers({
    generalAppMenu: function () {
        return _.filter(Maestro.Client.Menu, function(page){return page.access=="GENERAL";});
    },

    adminAppMenu: function () {
        return _.filter(Maestro.Client.Menu, function(page){return page.access=="ADMIN";});
    },

    showGeneralMenu: function() {
    	return Template.instance().showGeneralMenu.get();
    },

    showAdminMenu: function(){
    	return Template.instance().showAdminMenu.get();
    }
});

Template.POSMenu.events({
	'click .unlockAdminMenu': function(event, template){
		let business = Maestro.Business.getBusiness();

		let enteredPassword = document.getElementById('enteredAdminPassword').value;
		// console.log(enteredPassword);

		if(!!business){
			if(!!business.configuration){
				if(!!business.configuration.adminPin){
					if(enteredPassword == business.configuration.adminPin){
						template.showAdminMenu.set(true);
						Maestro.Client.toggleValidationClass("#enteredAdminPassword", true);
					} else {
						Maestro.Client.toggleValidationClass("#enteredAdminPassword", false);
					}
				} else {
					if(enteredPassword == "abcd1234"){
						template.showAdminMenu.set(true);
						Maestro.Client.toggleValidationClass("#enteredAdminPassword", true);
					} else {
						Maestro.Client.toggleValidationClass("#enteredAdminPassword", false);
					}
				}
			}
		}

	},

	'click .lockAdminMenu': function(event, template){
		template.showAdminMenu.set(false);
	}
});

