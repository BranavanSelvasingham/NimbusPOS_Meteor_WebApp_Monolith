//Scheduler Methods

Meteor.methods({
    initializeSyncedCron: function(){
        if(Meteor.isServer){
            Maestro.Scheduler.Initiate();
        }
    },

    remindEmployees: function(frequencyText, reminderDetails){
        var reminderId;
        try{
            reminderId = Reminders.insert(reminderDetails);
        } catch(e){
            console.log("Error creating reminder: " + e);
        }

        if(Meteor.isServer){
            Maestro.Reminders.Employees.Create(reminderId, frequencyText);
        }
    },

    deleteReminder: function(reminderId){
        var deleted;

        try {
            deleted = Reminders.remove(reminderId);
        } catch (e){
            console.log("Error deleting reminder: " + e);
        }

        if(Meteor.isServer){
            Maestro.Reminders.Employees.Delete(reminderId);
        }
    }
});
