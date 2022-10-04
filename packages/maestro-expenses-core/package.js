Package.describe({
  name: 'maestro-expenses-core',
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

  api.addFiles('model/expenses.js');
  api.export('Expenses');

  api.addFiles('methods/expenseMethods.js');

  api.addFiles('expensesPublications.js', 'server');

  api.addFiles('lib/maestro-expenses.js', 'client');
  api.addFiles('lib/maestro-expenses-categories.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');



});
