Maestro.Templates.ImportFile = "ImportFile";

Template.ImportFile.onRendered(function(){
    let template = this;

    template.dataFromFile = new ReactiveVar();
    template.headerFromFile = new ReactiveVar();
});

Template.ImportFile.onRendered(function(){

});

Template.ImportFile.helpers({
    getDataFromFile: function(event, target){
        return Template.instance().dataFromFile.get();
    },

});

Template.ImportFile.events({

    'click #readFile': function(event, template){
        var file = document.getElementById('selectFile').files[0];

        var reader = new FileReader();

        var parsedData;

        Papa.parse(file,{
                delimiter: "",  // auto-detect
                newline: "",    // auto-detect
                header: true,
                dynamicTyping: false,
                preview: 0,
                encoding: "",
                worker: false,
                comments: false,
                step: undefined,
                complete: function(results) {
                                                parsedData = results;
                                                template.dataFromFile.set(parsedData.data);
                                            },
                error: undefined,
                download: false,
                skipEmptyLines: false,
                chunk: undefined,
                fastMode: undefined,
                beforeFirstChunk: undefined,
                withCredentials: undefined
        });

    }

});