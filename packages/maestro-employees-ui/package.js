Package.describe({
  name: 'maestro-employees-ui',
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

  api.addFiles('employeesSubscriptions.js', 'client');

  api.addFiles('views/createEmployee.html', 'client');
  api.addFiles('views/emailReminderSettings.html', 'client');
  api.addFiles('views/enterEmployeeHours.html', 'client');
  api.addFiles('views/hoursCalendar.html', 'client');
  api.addFiles('views/hoursSummary.html', 'client');
  api.addFiles('views/listEmployees.html', 'client');
  api.addFiles('views/setPayrollInfo.html', 'client');
  api.addFiles('views/setupRemindersEmployees.html', 'client');
  api.addFiles('views/external/enterHours.html', 'client');

  api.addFiles('views/createEmployee.js', 'client');
  api.addFiles('views/emailReminderSettings.js', 'client');
  api.addFiles('views/enterEmployeeHours.js', 'client');
  api.addFiles('views/hoursCalendar.js', 'client');
  api.addFiles('views/hoursSummary.js', 'client');
  api.addFiles('views/listEmployees.js', 'client');
  api.addFiles('views/setPayrollInfo.js', 'client');
  api.addFiles('views/setupRemindersEmployees.js', 'client');
  api.addFiles('views/external/enterHours.js', 'client');

  api.addFiles('views/waiterLoginPage.html', 'client');
  api.addFiles('views/waiterLoginPage.js', 'client');

  api.addFiles('views/waiterLockSettings.html', 'client');
  api.addFiles('views/waiterLockSettings.js', 'client');

  api.addFiles('views/employeeTimeAdjustSettings.html', 'client');
  api.addFiles('views/employeeTimeAdjustSettings.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-employees-ui');
  api.addFiles('maestro-employees-ui-tests.js');
});
