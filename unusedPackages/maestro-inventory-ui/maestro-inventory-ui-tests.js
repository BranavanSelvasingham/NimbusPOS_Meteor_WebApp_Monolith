// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-inventory-ui.js.
import { name as packageName } from "meteor/maestro-inventory-ui";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-inventory-ui - example', function (test) {
  test.equal(packageName, "maestro-inventory-ui");
});
