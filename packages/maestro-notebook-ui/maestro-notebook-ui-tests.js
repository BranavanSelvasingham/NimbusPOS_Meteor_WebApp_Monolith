// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-notebook-ui.js.
import { name as packageName } from "meteor/maestro-notebook-ui";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-notebook-ui - example', function (test) {
  test.equal(packageName, "maestro-notebook-ui");
});
