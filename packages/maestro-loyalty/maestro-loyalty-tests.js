// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-loyalty.js.
import { name as packageName } from "meteor/maestro-loyalty";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-loyalty - example', function (test) {
  test.equal(packageName, "maestro-loyalty");
});
