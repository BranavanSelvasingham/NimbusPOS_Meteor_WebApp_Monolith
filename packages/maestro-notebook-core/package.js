Package.describe({
  name: 'maestro-notebook-core',
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
  api.mainModule('maestro-notebook-core.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], 'client');
  api.use('underscore', 'server');

  api.imply('maestro-base', ['client', 'server']);
  api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

  api.addFiles('model/notes.js');
  api.export('Notes');

  api.addFiles('lib/maestroNotes.js','client');

  api.addFiles('notebookPublications.js', 'server');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-notebook-core');
  api.mainModule('maestro-notebook-core-tests.js');
});
