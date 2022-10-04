Maestro.Templates.CreateNote = "CreateNote";

Template.CreateNote.onCreated(function(){

});

Template.CreateNote.onRendered(function(){
    $('#note_description').trigger('autoresize');
});

Template.CreateNote.helpers({

});

Template.CreateNote.events({
    'click #createNote': function(event, target){
        event.preventDefault();

        let noteTitle = document.getElementById('note_title').value;
        let noteDescription = document.getElementById('note_description').value;
        let visibilityBusiness = document.getElementById('setBusinessWide').checked;
        let visibilityLocation = document.getElementById('setLocationSpecific').checked;
        let visibilityUser = document.getElementById('setUserSpecific').checked;

        let businessId = Maestro.Business.getBusinessId();

        let newNote = {businessId: businessId};  
    
        if (!noteDescription.length){
            Materialize.toast('Enter something in the note', 2000);
            return;
        }

        newNote.description = noteDescription;

        if (!!noteTitle.length){
            newNote.title = noteTitle;
        }

        newNote.createdOn = new Date();

        let visibility = {
            businessWide: visibilityBusiness,
            locationSpecific: visibilityLocation,
            userSpecific: visibilityUser,
            customerSpecific: false,
            orderSpecific: false
        };

        if (visibility.locationSpecific){
            newNote.locationId = Maestro.Business.getLocationId();
        } else if (visibility.userSpecific){
            newNote.userId = Meteor.userId();
        }

        newNote.visibleTo = visibility;

        newNote.createdBy = Meteor.userId();

        Maestro.Notes.CreateNewNote(newNote);

        Materialize.toast('Note Saved', 1000);

        document.getElementById('createNoteForm').reset();

    },

    'click #cancelNote': function(event, target){
        document.getElementById('createNoteForm').reset();
        FlowRouter.go("/notebook");
    }

});