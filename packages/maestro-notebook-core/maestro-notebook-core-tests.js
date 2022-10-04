// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-notebook-core.js.
import { name as packageName } from "meteor/maestro-notebook-core";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-notebook-core - example', function (test) {
  test.equal(packageName, "maestro-notebook-core");
});
