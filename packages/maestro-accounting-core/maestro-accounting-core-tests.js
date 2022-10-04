// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-accounting-core.js.
import { name as packageName } from "meteor/maestro-accounting-core";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-accounting-core - example', function (test) {
  test.equal(packageName, "maestro-accounting-core");
});
