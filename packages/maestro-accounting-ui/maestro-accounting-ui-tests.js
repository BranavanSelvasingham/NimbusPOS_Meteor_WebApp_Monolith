// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-accounting-ui.js.
import { name as packageName } from "meteor/maestro-accounting-ui";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-accounting-ui - example', function (test) {
  test.equal(packageName, "maestro-accounting-ui");
});
