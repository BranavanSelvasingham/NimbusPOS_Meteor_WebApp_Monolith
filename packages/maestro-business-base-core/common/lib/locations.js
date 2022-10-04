Maestro.Locations = {};

Maestro.Locations.getEnabledPrinters = function(){
	let location = Maestro.Business.getLocation();
    let locationPrinters = location.printers || [];

	return _.reject(locationPrinters, function(printer){return printer.disabled === true;});    
};

Maestro.Locations.addPrinter = function(location, printer){
    if((printer.use != "MAIN") && (printer.use != "KITCHEN")){
        Materialize.toast('Use must be for MAIN or KITCHEN', 3000);
        return;
    }

    if((printer.connection != "USB") && (printer.connection != "WIRELESS")){
        Materialize.toast('Connection must be either USB or WIRELESS', 3000);
        return;
    }

    if (location){
        let allPrinters = location.printers || [];

        allPrinters.push(printer);

        console.log(location._id, allPrinters);

		Locations.update(location._id, {$set: {printers: allPrinters}});

		document.getElementById("add-printer").reset();
    }
};

Maestro.Locations.deletePrinter = function(location, deletePrinter){
	if (location){
	    if(location.printers){
	        let newSet = _.reject(location.printers, function(printer){
	        	return _.isEqual(printer, deletePrinter);
	        });
	        location.printers = newSet;
	    }

	    console.log(location._id, location.printers);

	    Locations.update(location._id, {$set: {printers: location.printers}});
	}
};

Maestro.Locations.enablePrinter = function(location, enablePrinter){
	if(location){
		if(location.printers){
			let newSet = _.map(location.printers, function(printer){
				if(_.isEqual(printer, enablePrinter)){
					return printer.disabled = false;
				} else {
					return printer;
				}
			});
		}

		console.log(location._id, location.printers);

		Locations.update(location._id, {$set: {printers: location.printers}});
	}
};

Maestro.Locations.disablePrinter = function(location, disablePrinter){
	if(location){
		if(location.printers){
			let newSet = _.map(location.printers, function(printer){
				if(_.isEqual(printer, disablePrinter)){
					return printer.disabled = true;
				} else {
					return printer;
				}
			});
		}

		console.log(location._id, location.printers);

		Locations.update(location._id, {$set: {printers: location.printers}});
	}
};

Maestro.Locations.Helpers = {
	countries: function() {
        // console.log("number of countries: ", countriesList);
        return countriesList;
    },

    provinces: function() {
        let provincesList = [
            {code: "AB", name: "Alberta"},
            {code: "BC", name: "British Columbia"},
            {code: "MB", name: "Manitoba"},
            {code: "NB", name: "New Brunswick"},
            {code: "NL", name: "Newfoundland and Labrador"},
            {code: "NS", name: "Nova Scotia"},
            {code: "NT", name: "Northwest Territories"},
            {code: "NU", name: "Nunavut"},
            {code: "ON", name: "Ontario"},
            {code: "PE", name: "Prince Edward Island"},
            {code: "QC", name: "Quebec"},
            {code: "SK", name: "Saskatchewan"},
            {code: "YT", name: "Yukon"},
        ];

        return provincesList;
    },

};

Maestro.Locations.Events = {
	'click #save-new-location-info': function(event, template) {
        let businessId = Maestro.Business.getBusinessId();

        let locationName = template.find("#location-name").value,
            street = template.find("#address-street").value,
            city = template.find("#address-city").value,
            state = template.find("#address-state").value,
            pin = template.find("#address-pin").value,
            country = template.find("#address-country").value;

        // let businessId = Maestro.Business.getBusinessId();

        if(!locationName){
            Materialize.toast("Please enter a name for your first location", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-name", false);
            return;
        }

        if(!street){
            Materialize.toast("Please enter the location's street address", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#address-street", false);
            return;
        }

        if(!city){
            Materialize.toast("Please enter the location's city", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#address-city", false);
            return;
        }

        if(!state){
            Materialize.toast("Please enter the location's province", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-state", false);
            return;
        }

        function checkPostal(postal) {
            var regex = new RegExp(/^\w{6}|\w{3}\s{1}\w{3}$/);
            // console.log(regex.test(postal.value));
            if (regex.test(postal.value)) {
                return true;
            } 

            return false;
        }

        if(!pin){
            Materialize.toast("Please enter the location's postal code", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-pin", false);
            return;
        } else if (!checkPostal(pin)){
            Materialize.toast("Please enter a valid postal code", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-pin", false);
            return;
        }

        if(!country){
            Materialize.toast("Please enter the country", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-country", false);
            return;
        }

        var locationDetails = {
            name: locationName,
            businessId: businessId,
            address: {
                street: street,
                city: city,
                state: state,
                pin: pin,
                country: country
            }
        };

        Meteor.call("addBusinessLocation", locationDetails, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Added location", 2000, 'rounded green');
            }

            FlowRouter.go(Maestro.route.ListLocations);
        });

    }

};
