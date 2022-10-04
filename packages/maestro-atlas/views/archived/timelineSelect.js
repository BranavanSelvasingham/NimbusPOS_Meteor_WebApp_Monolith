Maestro.Templates.TimelineSelect = "TimelineSelect";

Template.TimelineSelect.onRendered(function(){
	$('ul.tabs').tabs();
});

Template.TimelineSelect.helpers({
	locationName: function(){
		return Maestro.Business.getLocationName();
	}
});

Template.TimelineSelect.events({

});