
let createRoute = function(path, route, routeGroup) {
    var {name, action, template} = route;

    if(!action) {
        action = function(params, queryParams) {
            BlazeLayout.render("Layout", {content: template});
        };
    }

    let routeOptions = {
        name: name,
        action: action
    };

    if(routeGroup) {
        routeGroup.route(path, routeOptions);
    } else {
        FlowRouter.route(path, routeOptions);
    }

    //add to route names
    if(name && !Maestro.route[name]) {
        Maestro.route[name] = name;
    }
};

let generateRoutes = function(routes, routeGroup) {
    _.each(routes, function (route) {
        if(!!route.subroutes) { //route has subroutes
            let groupOptions = {
                prefix: route.path
            };

            //create a new route group
            let currentRouteGroup = (!routeGroup) ? FlowRouter.group(groupOptions) : routeGroup.group(groupOptions);

            //add root ("/") path of the group
            createRoute("/", route, currentRouteGroup);

            //create all subroutes
            generateRoutes(route.subroutes, currentRouteGroup);
        } else {
            createRoute(route.path, route, routeGroup);
        }
    });
};

Maestro.Client.initializeRoutes = generateRoutes;
