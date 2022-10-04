Maestro.Templates.CreateTable = "CreateTable";

Template.CreateTable.onCreated(function() {
	// let this = Template.instance();
	this.defaultSeats = new ReactiveVar();
	this.tableShape = new ReactiveVar();

	this.defaultSeats.set(4);
	this.tableShape.set('CIRCLE');
});

Template.CreateTable.onRendered(function() {

});

Template.CreateTable.helpers({
	getDefaultSeats: function(){
		return Template.instance().defaultSeats.get();
	},

	getTableShape: function(){
		return Template.instance().tableShape.get();
	}
});

Template.CreateTable.events({
	'click .increaseSeats': function(event, target){
		Template.instance().defaultSeats.set(Template.instance().defaultSeats.get() + 1);		
	},

	'click .decreaseSeats': function(event, target){
		let currentDefault = Template.instance().defaultSeats.get();
		if (currentDefault > 1){
			Template.instance().defaultSeats.set(currentDefault -1 );
		}
	},

    'click .createTable': function(event, target){
        let tableLabel = document.getElementById('tableLabelField').value;
        if(!tableLabel){
        	Materialize.toast('Enter a table label', 1000);
        	return;
        }
        let defaultSeats = Template.instance().defaultSeats.get();
        let shape = Template.instance().tableShape.get();
        Maestro.Tables.CreateTable(tableLabel, defaultSeats, shape);
        console.log('Table created');

        document.getElementById('tableLabelField').value="";
    },
});

