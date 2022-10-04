//isCordova variable
Maestro.Client.isCordova = Meteor.isCordova;
// Maestro.Client.isCordova = true;

let routes = Maestro.Client.AllRoutes;

//generate all routes
Maestro.Client.initializeRoutes(routes);

import { Meteor } from 'meteor/meteor'
//Menu
// Maestro.Client.Menu = Maestro.Client.createMenu(routes);


