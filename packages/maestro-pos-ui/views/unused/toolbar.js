Maestro.Templates.OrdersToolbar = "OrdersToolbar";

Template.OrdersToolbar.onRendered(function() {
    $("#selected-location").material_select();
});

Template.OrdersToolbar.helpers({
    selectedLocationId: function() {
        return Maestro.Client.locationId();
    }
});

Template.OrdersToolbar.events({
    'change #selected-location': function(event, template) {
        event.preventDefault();

        var selectedLocationId = template.find("#selected-location").value;
        check(selectedLocationId, String);

        Maestro.Client.selectLocationId(selectedLocationId);
    }
});

