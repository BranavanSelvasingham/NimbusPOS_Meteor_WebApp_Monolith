Package.describe({
  name: 'maestro-messages',
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
  api.mainModule('maestro-messages.js');

  var both = ['client', 'server'];
  var server = 'server';
  var client = 'client';
  var browserOnly = "web.browser";
  var cordovaOnly = "web.cordova";

  const requiredPackages = [
    'maestro-base',
    'maestro-users',
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.use(['ecmascript', 'underscore', 'mongo'], both);
  api.use(['templating', 'session', 'jquery'], client);

  api.addFiles([
      'model/publications.js',
  ], server);

  api.addFiles([
      'model/messages.js',
      'model/conversations.js',
  ], both);

  api.addFiles([
      'lib/client/maestro-messages.js',
      'views/supportChat.html',
      'views/supportChat.js',
  ], client);

  api.export('Conversations');
  api.export('Messages');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-messages');
  api.mainModule('maestro-messages-tests.js');
});
