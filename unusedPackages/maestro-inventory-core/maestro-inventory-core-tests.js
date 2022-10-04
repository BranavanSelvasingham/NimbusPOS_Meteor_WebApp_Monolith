// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by maestro-inventory-core.js.
import { name as packageName } from "meteor/maestro-inventory-core";

// Write your tests here!
// Here is an example.
Tinytest.add('maestro-inventory-core - example', function (test) {
  test.equal(packageName, "maestro-inventory-core");
});
