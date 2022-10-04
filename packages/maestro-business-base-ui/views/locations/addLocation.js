Maestro.Templates.AddLocation = "AddLocation";

Template.AddLocation.onRendered(function() {
    $("#address-country").material_select();
    $("#address-state").material_select();
});

Template.AddLocation.helpers(_.extend(Maestro.Locations.Helpers, {}));

Template.AddLocation.events(_.extend(Maestro.Locations.Events, {}));