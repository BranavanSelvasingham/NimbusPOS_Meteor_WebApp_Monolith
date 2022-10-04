Maestro.Tables={};
Maestro.Tables.Floor = {};

Maestro.Tables.CreateTable = function(tableLabel, defaultSeats, shape){
    let newTable = {
        businessId: Maestro.Business.getBusinessId(),
        locationId: Maestro.Business.getLocationId(),
        tableLabel: tableLabel,
        defaultSeats: defaultSeats,
        shape: shape
    };

    let newTableId = Tables.insert(newTable);

    console.log(newTableId);

};

Maestro.Tables.GetTablesForLocation = function(){
    let locationId = Maestro.Business.getLocationId();
    let getTables = Tables.find({locationId: locationId}).fetch();

    return getTables;
};

Maestro.Tables.GetSpecificTable = function(tableId){
    let getTable = Tables.findOne({_id: tableId});

    return getTable;
};

Maestro.Tables.GetSpecificTableLabel = function(tableId){
    let getTable = Maestro.Tables.GetSpecificTable(tableId) || {};
    return getTable.tableLabel || tableId;
};

Maestro.Tables.MoveTablePosition = function(tableId, dx, dy, dz = 0){
    // let new_position = {x:x < 0 ? 0 : x , y:y<0 ? 0: y, z:z<0 ? 0: z};
    let new_position = {x: dx, y: dy, z: dz};

    let table = Maestro.Tables.GetSpecificTable(tableId);

    if(!!table.position){
        new_position.x += table.position.x;
        new_position.y += table.position.y;
        new_position.z += table.position.z;
    }

    new_position.x = new_position.x < 0 ? 0 : new_position.x;
    new_position.y = new_position.y < 0 ? 0 : new_position.y;
    new_position.z = new_position.z < 0 ? 0 : new_position.z;

    console.log('new position: ', new_position);
    Tables.update({_id: tableId}, {$set: {position: new_position}});
};

Maestro.Tables.Floor.MoveCornerPoint = function(newPoint, polySet, section){
    // location.floorLayoutSections[section].vertices
    console.log('received: ', newPoint, polySet);

    let new_position = {x: newPoint.dx, y: newPoint.dy};

    let current_location = Maestro.Business.getLocation();

    let floorSections = [];

    if(!!current_location.floorLayoutSections){
        if(!!current_location.floorLayoutSections[section].vertices){
            new_position.x += current_location.floorLayoutSections[section].vertices[newPoint.id].x || 0;
            new_position.y += current_location.floorLayoutSections[section].vertices[newPoint.id].y || 0;
            // new_position.z += current_location.position.z;
            floorSections = current_location.floorLayoutSections;
        } else {
            // a mechanism to increase the number of sections needed
        }
    } else {
        // floorSections = [];
    }

    new_position.x = new_position.x < 0 ? 0 : new_position.x;
    new_position.y = new_position.y < 0 ? 0 : new_position.y;

    let newPolySet = _.map(polySet, function(point){
        console.log({x: point.x, y: point.y});
        return {x: point.x, y: point.y};
    });

    newPolySet[newPoint.id] = new_position;
    console.log('new poly set after new position: ', newPolySet);

    if(!!floorSections.length){
        floorSections[section].vertices = newPolySet;
    } else {
        floorSections.push({name: 'Ground Floor', vertices: newPolySet});
    }

    
    console.log('new position: ', new_position);
    console.log('new polySet: ', newPolySet);
    console.log('new floor sections: ', floorSections);

    Locations.update({_id: current_location._id}, {$set: {floorLayoutSections: floorSections}});

    console.log('updated current_location corner');
};

Maestro.Tables.Floor.selectFloorTile = function(floorTile, section){
    if(!floorTile){console.log('no floor tile received'); return;}
    if(!floorTile.url){console.log('no url received');return;}
    let current_location = Maestro.Business.getLocation();
    let floorSections = current_location.floorLayoutSections || [{}];
    console.log(current_location);
    floorSections[section].floorTile = floorTile;

    Locations.update({_id: current_location._id}, {$set: {floorLayoutSections: floorSections}});

};

Maestro.Tables.Floor.getFloorTileOptions = function(){
    return [
        {   name: "Floor Wooden Grey",
            url: "/floor-wooden-grey.jpg"
        },
        {   name: "Floor Wooden Light",
            url: "/floor-wooden-light.jpg"
        },
        {
            name: "Floor Ceramic Warm",
            url: "/floor-ceramic-warm.jpg"
        }
    ];
};

Maestro.Tables.getTableShapeOptions = function(){
    return ['Circle', 'Square', 'Rectangle'];
};

Maestro.Tables.setTableShape = function(tableId, shape){
    Tables.update({_id: tableId}, {$set: {shape: shape}});
};

Maestro.Tables.setTableDefaultSeats = function(tableId, seats){
    if(seats > 0){
        Tables.update({_id: tableId}, {$set: {defaultSeats: seats}});
    }
};

Maestro.Tables.setTableLabel = function(tableId, label){
    console.log(tableId, label);
    Tables.update({_id: tableId}, {$set: {tableLabel: label}});
};

// Maestro.Tables.getTablesInUse = function(){
//     let incompleteOrdersToday = Maestro.Order.GetDailyIncompleteOrders();
//     // let tablesInUse = _.pluck(incompleteOrdersToday, "tableId");
//     let tablesInUse = _.map(incompleteOrdersToday, function(order){
//         return {orderId: order._id, tableId: order.tableId, orderNumber: order.uniqueOrderNumber};
//     })
//     // tablesInUse = _.uniq(tablesInUse);

//     return tablesInUse;

// };

Maestro.Tables.getAllTablesForSVG = function(){
    let existingTables = Maestro.Tables.GetTablesForLocation();

    let incompleteOrdersToday = Maestro.Order.GetDailyIncompleteOrders();
    let inUseTableIds = _.pluck(incompleteOrdersToday, "tableId");

    let circleData = [];
    // console.log('redrawing svg');

    _.each(existingTables, function(table, index){
        let tablex, tabley, color, inUse, tableLabel, inUseOrder, inUseOrderId;

        if(!!table.position){
            tablex = table.position.x || 0;
            tabley = table.position.y || 0;
        } else {
            tablex = 0;
            tabley = 0;
        }

        if(_.contains(inUseTableIds, table._id)){
            inUse = true;
            inUseOrder = _.findWhere(incompleteOrdersToday, {tableId: table._id});
            inUseOrderId = inUseOrder._id;
            color = "yellow";
            tableLabel = table.tableLabel + " (#" + inUseOrder.uniqueOrderNumber + ")"; 
        } else {
            inUse = false;
            color = "white";
            tableLabel = table.tableLabel;
        }

        circleData.push({"cx":  tablex, "cy": tabley, "radius": 50, "color" : color, "outline": "black", "label": tableLabel || "A#", "id": table._id, "inUse": inUse, "inUseOrderId": inUseOrderId});
        // circleData.push({"cx":  100, "cy": 100, "radius": 50, "color" : "white", "outline": "black", "label": table.tableLabel || "A#", "id": table._id});
    });

    return circleData;

};