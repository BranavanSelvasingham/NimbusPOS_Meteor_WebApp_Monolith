Reminders = new Mongo.Collection("reminders");

Maestro.Schemas.Reminder = new SimpleSchema({
	businessId: {
		type: String
	},
	name: {
		type: String
	},
	details: {
		type: String
	}
});

Reminders.attachSchema(Maestro.Schemas.Reminder);
