Maestro.Templates.POSPrinterSettings = "POSPrinterSettings";

var selectedLocation = new ReactiveVar();

Template.POSPrinterSettings.onCreated(function() {
    selectedLocation.set(Maestro.Business.getLocation());

    this.autorun(function(){
        Locations.find({});
        selectedLocation.set(Maestro.Business.getLocation());
        console.log('updated');
    })
});


Template.POSPrinterSettings.onRendered(function() {
    // selectedLocation.set(this.data);

    console.log('printer settings rendered', selectedLocation.get());
});

Template.POSPrinterSettings.helpers({
	getSelectedLocation: function(){
        console.log(Template.instance().data);
        console.log('getting');
        return selectedLocation.get();
	},

});

Template.POSPrinterSettings.events({
    'click .saveReceiptNote': function(event, template){
        event.preventDefault();

        let receiptNote = template.find("#newReceiptMessage").value;

        let location = selectedLocation.get();

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

        let location = selectedLocation.get();
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
        let location = selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let deletePrinter = this;

        Maestro.Locations.deletePrinter(location, deletePrinter);
    },

    'click .enablePrinter': function(event, template){
        let location = selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let enablePrinter = this;

        Maestro.Locations.enablePrinter(location, enablePrinter);
    },    

    'click .disablePrinter': function(event, template){
        let location = selectedLocation.get();
        location = Locations.findOne({_id: location._id});

        let disablePrinter = this;

        Maestro.Locations.disablePrinter(location, disablePrinter);
    },

    // 'click .printSample': function(event, template) {
    //     event.preventDefault();

    //     let printJob = new Maestro.Print.Job();

    //     printJob.textDouble('Title Text\n')
    //         .textStyled('Styled text', 'BU', 'center', 'a', 2, 2)
    //         .lineBreak()
    //         .text('First Line')
    //         .lineBreak()
    //         .barcode('123413')
    //         .lineBreak()
    //         .qr('www.nimbupos.com')
    //         .lineBreak()
    //         .textDoubleHeight('Double Height Text')
    //         .lineBreak()
    //         .textDoubleWidth('Double Width Text')
    //         .lineBreak()
    //         .textInverted('Inverted text')
    //         .lineBreak()
    //         .cut();


    //     let sample = {
    //         "one": "{data first}",
    //         "printjob": "{\"cmd\":\"text\", \"data\":\"Printing all this first time on now\\n\"}{\"cmd\":\"qr\", \"data\":\"https://www.nimbuspos.com\"}{\"cmd\":\"barcode\", \"data\":\"987654321\", \"bc\":\"EAN13\"}{\"cmd\":\"cut\"}"
    //     };

    //     sample = {};

    //     sample.printjob = printJob.build();


    //     let printer = {
    //         name: this.name,
    //         connection: this.connection,
    //         address: this.address
    //     };

    //     console.log('comands :: ', printJob.commands());
    //     console.log('printing to address ::', printer.address);
    //     HTTP.call(
    //         'POST',
    //         'http://' + printer.address,
    //         {
    //             data: sample
    //         },
    //         function(printError, printResult) {
    //             console.log('Print Error :: ', printError);
    //             console.log('Print Result :: ', printResult);
    //         }
    //     );

    // }

});