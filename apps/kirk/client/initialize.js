//isCordova variable
Maestro.Client.isCordova = Meteor.isCordova;
// Maestro.Client.isCordova = true;

let routes;

if(Maestro.Client.isCordova){
	routes = Maestro.Client.PosRoutes;
} else {
	routes = Maestro.Client.AllRoutes;
}

//generate all routes
Maestro.Client.initializeRoutes(routes);

//Menu
Maestro.Client.Menu = Maestro.Client.createMenu(routes);

Maestro.Client.FlattenMenu = function(){
	let flattenedMenu = [];
	_.each(Maestro.Client.Menu, function(menuItem){
		flattenedMenu.push(menuItem);
		if(menuItem.submenu){
			_.each(menuItem.submenu, function(menuItem){
				flattenedMenu.push(menuItem);
				if(menuItem.submenu){
					_.each(menuItem.submenu, function(menuItem){
						flattenedMenu.push(menuItem);
					});
				}
			});
		}
	});
	// console.log(flattenedMenu);
	return flattenedMenu;
};

Maestro.Client.FlattenedMenu = Maestro.Client.FlattenMenu();

Maestro.Client.MenuGroups = function(groupName){
	return _.filter(Maestro.Client.FlattenedMenu, function(menuItem){
		return menuItem.group == groupName;
	});
};

Maestro.Client.AllMenuGroupNamesOrdered = [
	{groupName: "Business"},
	{groupName: "Customers"},
	{groupName: "Products"},
	{groupName: "POS"},
	{groupName: "Tools"},
	{groupName: "Settings"},
	{groupName: "Support"},
	{groupName: "Logout"},
];

Maestro.Client.SetGroupedMenuItems = function(){
	_.each(Maestro.Client.AllMenuGroupNamesOrdered, function(group){
		group.menuItems = Maestro.Client.MenuGroups(group.groupName);
	})
}

Maestro.Client.SetGroupedMenuItems();
