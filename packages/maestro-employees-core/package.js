Package.describe({
  name: 'maestro-employees-core',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');

  api.use(['underscore', 'templating', 'session', 'jquery'], 'client');
  api.use('underscore', 'server');

  api.imply('maestro-base', ['client', 'server']);
  api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

  api.addFiles('methods/employeeMethods.js');

  api.addFiles('model/employees.js');
  api.export('Employees');

  api.addFiles('employeesPublications.js', 'server');

  api.addFiles('lib/client/maestro.js', 'client');
  api.addFiles('lib/client/maestroEmployees.js', 'client');
  api.addFiles('lib/server/maestro-contactEmployee.js', 'server');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-employees-core');
  api.addFiles('maestro-employees-core-tests.js');
});