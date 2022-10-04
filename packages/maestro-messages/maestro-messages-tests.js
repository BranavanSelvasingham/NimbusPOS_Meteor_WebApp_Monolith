// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-messages.js.
import { name as packageName } from "meteor/maestro-messages";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-messages - example', function (test) {
  test.equal(packageName, "maestro-messages");
});
