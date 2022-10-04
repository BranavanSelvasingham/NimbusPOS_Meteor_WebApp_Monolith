Package.describe({
  name: 'maestro-notebook-ui',
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
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.mainModule('maestro-notebook-ui.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client']);

  const requiredPackages = [
      'maestro-base',
      'maestro-users'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles('notebookSubscriptions.js', 'client');

  api.addFiles('views/createNote.html', 'client');
  api.addFiles('views/createNote.js', 'client');

  api.addFiles('views/noteBook.html', 'client');
  api.addFiles('views/noteBook.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-notebook-ui');
  api.mainModule('maestro-notebook-ui-tests.js');
});
