Maestro.Templates.ManageAddons = "ManageAddons";

Template.ManageAddons.onRendered( function() {
    $('.updateAddon').hide();
    $('.undoUpdateAddon').hide();
    $('#ArchivedAddons').hide();
    $('#hideArchived').hide();
});

Template.ManageAddons.helpers({
    list_pure_addons: function(){
        return ProductAddons.find({status:'Active', isSubstitution: {$ne: true}});
    },

    list_substitutions: function(){
        return ProductAddons.find({status:'Active', isSubstitution: true});
    },

    list_archived_pure_addons: function(){
        return ProductAddons.find({status:'Archived', isSubstitution: {$ne: true}});
    },

    list_archived_substitutions: function(){
        return ProductAddons.find({status:'Archived', isSubstitution: true});
    },
});

Template.ManageAddons.events({
    'click #showArchived':function(event, target){
        $('#ArchivedAddons').show();
        $('#hideArchived').show();
        $('#showArchived').hide();
    },

    'click #hideArchived':function(event, target){
        $('#ArchivedAddons').hide();
        $('#showArchived').show();
        $('#hideArchived').hide();
    },

    'click .modifyAddonField': function(event, target){
        var element_id = event.target.id;
        var element_id_split = (element_id).split('_');
        var addonId = element_id_split[0];

        $('#'+addonId+'_update').show();
        $('#'+addonId+'_undoupdate').show();
    },

	'click .createAddon': function (event, target) {
        event.preventDefault();

        var addonName = target.find("#inputAddonName").value;

        var addonPrice = Number(target.find("#addonPrice").value);

        var businessId = Maestro.Business.getBusinessId();

        var addonDetails = {
            name: addonName,
            price: addonPrice,
            isSubstitution: false,
            status: 'Active',
            businessId: businessId
        };

        Meteor.call("createAddon", addonDetails, function (error, result) {
            if (error) {
                console.log("Error received:"+error);
            } else {
                Materialize.toast("Added " + addonName, 4000);
            }

            var addons = (ProductAddons.find({})).count();

            document.getElementById("manageAddonForm").reset();

            $('.updateAddon').hide();
            $('.undoUpdateAddon').hide();

        });
    },

    'click .createSubstitution': function (event, target) {
        event.preventDefault();

        let substituteNo = String(document.getElementById('new-substitute-label-NO').value);
        let substituteADD = String(document.getElementById('new-substitute-label-ADD').value);
        let substitutePrice = Number(document.getElementById('new-substitute-price').value);
        
        let addonName = "";

        if(!substituteNo & !substituteADD){return;}

        if(!!substituteNo){addonName += "NO: "+substituteNo}
        if(!!substituteADD){
            if(!!addonName){addonName += ", ";}
            addonName += "ADD: " + substituteADD}

        if(!addonName){return;}

        var businessId = Maestro.Business.getBusinessId();

        var addonDetails = {
            name: addonName,
            price: substitutePrice,
            isSubstitution: true,
            status: 'Active',
            businessId: businessId
        };

        Meteor.call("createAddon", addonDetails, function (error, result) {
            if (error) {
                console.log("Error received:"+error);
            } else {
                Materialize.toast("Added " + addonName, 4000);
            }

            var addons = (ProductAddons.find({})).count();

            document.getElementById("manageAddonForm").reset();

            $('.updateAddon').hide();
            $('.undoUpdateAddon').hide();

        });
    },

    'click .undoUpdateAddon': function(event, target){
        var element_id = event.target.id;
        var element_id_split = (element_id).split('_');
        var addonId = element_id_split[0];

        var tempAddons = ProductAddons.find({_id:addonId}).fetch();

        document.getElementById(addonId+"_name").value=tempAddons[0].name;
        document.getElementById(addonId+"_price").value=tempAddons[0].price;
        
        $('#'+addonId+'_update').hide();
        $('#'+addonId+'_undoupdate').hide();
    },

    'click .updateAddon': function(event, target){
        var element_id = event.target.id;
        var element_id_split = (element_id).split('_');
        var addonId = element_id_split[0];
        
        var addonDetails = {
            name: document.getElementById(addonId+"_name").value,
            price: Number(document.getElementById(addonId+"_price").value)
        };
        
        Meteor.call("updateAddon", addonId, addonDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
            $('#'+addonId+'_update').hide();
            $('#'+addonId+'_undoupdate').hide();
        });
    },

    'click .archiveAddon': function(event,target){
    	var element_id = event.target.id;
        var element_id_split = (element_id).split('_');
        var addonId = element_id_split[0];
        
        var addonDetails = {
            status: 'Archived'
        };
        
        Meteor.call("updateAddon", addonId, addonDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 

        });

    },

    'click .activateAddon': function(event,target){
        var element_id = event.target.id;
        var element_id_split = (element_id).split('_');
        var addonId = element_id_split[0];
        
        var addonDetails = {
            status: 'Active'
        };
        
        Meteor.call("updateAddon", addonId, addonDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
            $('.updateAddon').hide();
            $('.undoUpdateAddon').hide();

        });

    }

});