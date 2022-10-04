let _createMenu = function(route) {
    var {menu, name, icon, subroutes} = route;

    if(menu) {
        var menuItem = {routeName: name, label: menu, icon: icon};

        if(subroutes) {
            menuItem.submenu = _generateMenu(subroutes);
        }

        return menuItem;
    }
};

var _generateMenu = function (routes) {
    return _.reject(
        _.map(routes, function(route) {
            if(route.menu) {
                return _createMenu(route);
            }
        }),
        _.isUndefined);
};


Maestro.Client.createMenu = _generateMenu;