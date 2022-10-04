Maestro.Templates.NoteBook = "NoteBook";

Template.NoteBook.onCreated(function(){
	let template = this;

	template.selectedNote = new ReactiveVar();
	template.selectedNote.set();

	Template.instance().subscribe("notes", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});

Template.NoteBook.onRendered(function(){
	let template = this;

	$('selectedNoteDescription').trigger('autoresize');
});

Template.NoteBook.helpers({
	getVisibleNotes: function(){
		return Maestro.Notes.GetAllVisibleNotes();
	},

	isNoteSelected: function(noteId){
		if(Template.instance().selectedNote.get()){
			if(Template.instance().selectedNote.get()._id == noteId){
				return true;
			}
		}
		return false;
	},

	getSelectedNote: function(){
		return Template.instance().selectedNote.get();
	},

	getNoteVisibility: function(visibleTo){
		if(visibleTo.businessWide){
			return "Business-Wide";
		} else if (visibleTo.locationSpecific){
			return "Only This Location";
		} else if (visibleTo.userSpecific){
			return "Only This User Account";
		}
	},

	getNoteVisibilityIcon: function(visibleTo){
		if(visibleTo.businessWide){
			return "business";
		} else if (visibleTo.locationSpecific){
			return "location_on";
		} else if (visibleTo.userSpecific){
			return "person";
		}
	},

	initializeForm: function(){
		window.setTimeout(function(){$('#selectedNoteDescription').trigger('autoresize');});
	},

});

Template.NoteBook.events({
	'click .selectNote': function(event, template){
		template.selectedNote.set(this);
	},

	'click .deleteThisNote': function(event, template){
		Maestro.Notes.RemoveNote(this._id);
		template.selectedNote.set();
	},

	'click .refreshChanges': function(event, template){
		document.getElementById('selectedNoteTitle').value = template.selectedNote.get().title;
		document.getElementById('selectedNoteDescription').value = template.selectedNote.get().description;
	},

	'click .saveChanges': function(event, template){
		let noteTitle = document.getElementById('selectedNoteTitle').value;
		let noteDescription = document.getElementById('selectedNoteDescription').value;

		let updateNote = {title: noteTitle, description: noteDescription};

		Maestro.Notes.UpdateNote(template.selectedNote.get()._id, updateNote);

		Materialize.toast('Note Updated', 1000);

		template.selectedNote.set(Notes.findOne({_id: template.selectedNote.get()._id}));
	},

	// 'click .setVisibilityBusinessWide': function(event, template){

	// 	let updateNote = {title: noteTitle, description: noteDescription};

	// 	Maestro.Notes.UpdateNote(template.selectedNote.get()._id, updateNote);
	// },

	// 'click .setVisibilityLocationSpecific': function(event, template){

	// },

	// 'click .setVisibilityUserSpecific': function(event, template){

	// },

});