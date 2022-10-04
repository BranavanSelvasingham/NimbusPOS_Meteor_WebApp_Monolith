Meteor.methods({
    addBusinessLocation: function(locationDetails){
        check(locationDetails, Maestro.Schemas.Location);

        return Locations.insert(locationDetails);
    },

    editBusinessLocationDetails: function(locationId, locationDetails){
        // check(locationDetails, Maestro.Schemas.Location);

        Locations.update(locationId, {$set: locationDetails});
    },

    printerToLocation: function(locationId, printerDetails){
    	Locations.update(locationId, {$set: {printers: printerDetails}});
    },
});