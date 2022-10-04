Maestro.Templates.ListLocations = "ListLocations";


Template.ListLocations.onCreated(function() {
    let template = this;

    template.selectedLocation = new ReactiveVar();
    template.selectedLocation.set(Locations.findOne({}));

    template.staticLocationDetailsMode = new ReactiveVar();
    template.staticLocationDetailsMode.set(true);

    template.editLocationDetailsMode = new ReactiveVar();
    template.editLocationDetailsMode.set(false);
});


Template.ListLocations.onRendered(function() {

});

Template.ListLocations.helpers({
	getSelectedLocation: function(){
        let location = Template.instance().selectedLocation.get();
        if(location){
            return Locations.findOne({_id: location._id});
        }
	},

    isSelectedLocation: function(locationId){
        let chosenLocation = Template.instance().selectedLocation.get();
        if (chosenLocation){
            let chosenLocationId = chosenLocation._id;

            if (locationId == chosenLocationId){
                return 'background-color:lightblue;'
            } else {
                return;
            }
        } else {return;}
    },

    staticLocationMode: function(){
        return Template.instance().staticLocationDetailsMode.get();
    },

    editLocationMode: function(){
        return Template.instance().editLocationDetailsMode.get();
    },
});

Template.ListLocations.events({
	'click .locationSelected': function(event, template) {
	 	template.selectedLocation.set(this);
        // console.log(this);
	},
    'click .editLocationDetails': function(event, template) {
        template.staticLocationDetailsMode.set(false);
        template.editLocationDetailsMode.set(true);
    },
    'click .cancelEditMode': function(event, template){
        template.editLocationDetailsMode.set(false);
        template.staticLocationDetailsMode.set(true);
    },
	'click #save-edit-location': function(event, template) {
        event.preventDefault();

        let currentDetails = template.selectedLocation.get();
        let country = currentDetails.address.country;
        let state = currentDetails.address.state;
        let locationId = currentDetails._id;

        var locationName = template.find("#location-name").value,
            street = template.find("#address-street").value,
            city = template.find("#address-city").value,
            pin = template.find("#address-pin").value;

        var locationDetails = {
            name: locationName,
            address: {
                street: street,
                city: city,
                state: state,
                pin: pin,
                country: country
            }
        };

        Meteor.call("editBusinessLocationDetails", locationId, locationDetails, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated location", 4000);
                template.editLocationDetailsMode.set(false);
                template.staticLocationDetailsMode.set(true);
            }

        });

    },

    'click .saveReceiptNote': function(event, template){
        event.preventDefault();

        let receiptNote = template.find("#newReceiptMessage").value;

        let location = template.selectedLocation.get();

        Meteor.call('editBusinessLocationDetails', location._id, {receiptMessage: receiptNote}, function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast('Updated', 2000);
            }
        });
    },


    'click .addPrinter': function(event, template){
        event.preventDefault();

        let location = template.selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let printerName = template.find("#printer-name").value,
            printerUse = template.find("#printer-use").value,
            connectionType = template.find("#connection-type").value,
            address = template.find("#printer-address").value;

        let printer = {
            connection: connectionType,
            use: printerUse,
            address: address,
            name: printerName
        };

        Maestro.Locations.addPrinter(location, printer);
    },

    'click .deletePrinter': function(event, template){
        let location = template.selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let deletePrinter = this;

        Maestro.Locations.deletePrinter(location, deletePrinter);
    },

    'click .enablePrinter': function(event, template){
        let location = template.selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let enablePrinter = this;

        Maestro.Locations.enablePrinter(location, enablePrinter);
    },    

    'click .disablePrinter': function(event, template){
        let location = template.selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let disablePrinter = this;

        Maestro.Locations.disablePrinter(location, disablePrinter);
    },

    'click .printSample': function(event, template) {
        event.preventDefault();

        let printJob = new Maestro.Print.Job();

        printJob.textDouble('Title Text\n')
            .textStyled('Styled text', 'BU', 'center', 'a', 2, 2)
            .lineBreak()
            .text('First Line')
            .lineBreak()
            .barcode('123413')
            .lineBreak()
            .qr('www.nimbupos.com')
            .lineBreak()
            .textDoubleHeight('Double Height Text')
            .lineBreak()
            .textDoubleWidth('Double Width Text')
            .lineBreak()
            .textInverted('Inverted text')
            .lineBreak()
            .cut();


        let sample = {
            "one": "{data first}",
            "printjob": "{\"cmd\":\"text\", \"data\":\"Printing all this first time on now\\n\"}{\"cmd\":\"qr\", \"data\":\"https://www.nimbuspos.com\"}{\"cmd\":\"barcode\", \"data\":\"987654321\", \"bc\":\"EAN13\"}{\"cmd\":\"cut\"}"
        };

        sample = {};

        sample.printjob = printJob.build();


        let printer = {
            name: this.name,
            connection: this.connection,
            address: this.address
        };

        console.log('comands :: ', printJob.commands());
        console.log('printing to address ::', printer.address);
        HTTP.call(
            'POST',
            'http://' + printer.address,
            {
                data: sample
            },
            function(printError, printResult) {
                console.log('Print Error :: ', printError);
                console.log('Print Result :: ', printResult);
            }
        );

    }

});