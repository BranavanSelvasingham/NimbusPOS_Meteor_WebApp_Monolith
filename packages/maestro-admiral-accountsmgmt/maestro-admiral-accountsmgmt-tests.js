// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-admiral-accountsmgmt.js.
import { name as packageName } from "meteor/maestro-admiral-accountsmgmt";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-admiral-accountsmgmt - example', function (test) {
  test.equal(packageName, "maestro-admiral-accountsmgmt");
});
