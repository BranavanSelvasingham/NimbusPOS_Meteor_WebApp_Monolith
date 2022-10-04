// Activity = {};

// Activity.CreateLog = function(applicationId, description, createdOn){
// 	ActivityLog.insert({
// 		applicationId: applicationId,
// 		description: description,
// 		logCreatedOn: createdOn
// 	});
// };

// Activity.WelcomeLog = function(){
// 	let now = new Date();
// 	let applicationId = Session.get("APPLICATION");
// 	let description = "Just entered site";

// 	// console.log(now, applicationId, description);
// 	Activity.CreateLog(applicationId, description, now);
// };

// Activity.StartedSession = function(){
// 	let now = new Date();
// 	let applicationId = Session.get("APPLICATION");
// 	let description = "Coming in from application link";

// 	// console.log(now, applicationId, description);
// 	Activity.CreateLog(applicationId, description, now);
// };

// Activity.Explored = function(elem){
// 	let now = new Date();
// 	let applicationId = Session.get("APPLICATION");
// 	let description = "Clicked on " + elem;

// 	// console.log(description);

// 	Activity.CreateLog(applicationId, description, now);
// };

// Activity.FinishedExploring = function(){
// 	let now = new Date();
// 	let applicationId = Session.get("APPLICATION");
// 	let description = "Closed Tile";

// 	// console.log(description);

// 	Activity.CreateLog(applicationId, description, now);
// };