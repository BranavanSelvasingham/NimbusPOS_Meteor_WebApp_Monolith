Maestro.Notes = {}

Maestro.Notes.CreateNewNote = function(newNote){
    check(newNote, Maestro.Schemas.Note);

    var noteId;

    noteId = Notes.insert(newNote);

    return noteId;

};

Maestro.Notes.RemoveNote = function(noteId){
    var updated;

    updated = Notes.remove(noteId);

};

Maestro.Notes.UpdateNote = function(noteId, noteDetails){
	var updated;

    try {
        updated = Notes.update(noteId, {$set: noteDetails});
    } catch(e){
        console.log("Error updating Note: " + e);
    }
};

Maestro.Notes.GetAllVisibleNotes = function(){
	let locationId = Maestro.Business.getLocationId();
	let userId = Meteor.userId();

	let businessWideNotes = Notes.find({'visibleTo.businessWide': true}).fetch();

	let locationSpecificNotes = Notes.find({'visibleTo.locationSpecific': true, locationId: locationId}).fetch();

	let userSpecificNotes = Notes.find({'visibleTo.userSpecific': true, userId: userId}).fetch();

	let allVisibleNotes = $.merge(businessWideNotes, $.merge(locationSpecificNotes, userSpecificNotes));

	allVisibleNotes = _.sortBy(allVisibleNotes, 'createdOn');

	allVisibleNotes = allVisibleNotes.reverse();

	return allVisibleNotes;
};