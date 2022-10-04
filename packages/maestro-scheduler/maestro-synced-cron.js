var _startSyncedCron = function(){
	SyncedCron.start();
};

var _addSchedule = function(scheduleName, frequencyText, jobFunction){
	SyncedCron.add({
		name: scheduleName,
		schedule: function(parser) {
		// parser is a later.parse object
		return parser.text(frequencyText);
		},
		job: jobFunction
	});
};

var _deleteSchedule = function(reminderName){
	SyncedCron.remove(reminderName);
}

Maestro.Scheduler.Initiate = _startSyncedCron;
Maestro.Scheduler.Create = _addSchedule;
Maestro.Scheduler.Delete = _deleteSchedule;

