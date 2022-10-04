Package.describe({
  name: 'maestro-expenses-ui',
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

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client']);

  const requiredPackages = [
      'maestro-base',
      'maestro-users'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles('expensesSubscriptions.js', 'client');

  api.addFiles('views/createExpense.html', 'client');
  api.addFiles('views/listExpenses.html', 'client');

  api.addFiles('views/createExpense.js', 'client');
  api.addFiles('views/listExpenses.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');



});
