Maestro.Templates.LayoutEditor = "LayoutEditor";

Template.LayoutEditor.onCreated(function() {
    let template = this;

    template.initialTranslate;
    template.initialScale;

    template.initiateFloorPlan = function(template){
        $('#floor-layout').empty();
       
        var existingTables = Maestro.Tables.GetTablesForLocation();
        var circleData = [];
        console.log('redrawing svg');

        _.each(existingTables, function(table, index){
            let tablex, tabley;

            if(!!table.position){
                tablex = table.position.x || 0;
                tabley = table.position.y || 0;
            } else {
                tablex = 0;
                tabley = 0;
            }
            circleData.push({"cx":  tablex, "cy": tabley, "radius": 50, "color" : "white", "outline": "black", "label": table.tableLabel || "A#", "id": table._id});
            // circleData.push({"cx":  100, "cy": 100, "radius": 50, "color" : "white", "outline": "black", "label": table.tableLabel || "A#", "id": table._id});
        });

        console.log('tables: ', existingTables);

        var svgWidth = $('#floor-layout').width(),
            svgHeight = $('#floor-layout').height();

        var zoom = d3.behavior.zoom()
            .scaleExtent([0.25, 2])
            .on("zoom", zoomed);

        var svg = d3.select("#floor-layout").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
          .append("g")
            // .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
            .call(zoom);

        var rect = svg.append("rect")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("fill", "none")
            // .style("stroke", 'green')
            .style("pointer-events", "all");

        var container = svg.append("g");

        if(!!template.initialTranslate && !!template.initialScale){
            container.attr("transform", "translate(" + template.initialTranslate + ")scale(" + template.initialScale + ")");
        }

        gridLines = container.append("g");

        var xLines = gridLines.append("g")
                                .attr("class", "x axis")
                              .selectAll("line")
                                .data(d3.range(0, svgWidth*2, 10))
                              .enter().append("line")
                                .attr("x1", function(d) { return d; })
                                .attr("y1", 0)
                                .attr("x2", function(d) { return d; })
                                .attr("y2", svgHeight*2);

        var yLines = gridLines.append("g")
                                .attr("class", "y axis")
                              .selectAll("line")
                                .data(d3.range(0, svgHeight*2, 10))
                              .enter().append("line")
                                .attr("x1", 0)
                                .attr("y1", function(d) { return d; })
                                .attr("x2", svgWidth*2)
                                .attr("y2", function(d) { return d; });


        function zoomed() {
          container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
          template.initialTranslate = d3.event.translate;
          template.initialScale = d3.event.scale;
        }

        var editTablePosition = d3.behavior.drag()
                                            .origin(function() { 
                                                    var t = d3.select(this);
                                                    return {x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
                                                            y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]};
                                                })
                                            .on("dragstart", table_dragstarted)
                                            .on("drag", table_dragged)
                                            .on("dragend", table_dragended);
        function table_dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();

            // console.log('d3 element: ', this);
            // d3.select(this).classed("dragging", true);
        }

        function table_dragged(d) {
            // console.log('d3 event: ', d3.event);
            
            // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            // d3.select(this).attr("transform", "translate(" + d3.event.dx + ", " + d3.event.dy + ")");
            d3.select(this).attr("transform", function(d,i){return "translate(" + [ d3.event.x, d3.event.y ] + ")"});
        }

        function table_dragended(d) {
            // d3.select(this).classed("dragging", false);
            // console.log('d var: ', d);
            // console.log('drag event: ', d3.event.x, d3.event.y);
            // let t = d3.select(this);
            // let x_new = d.x; //t.attr('x');
            // let y_new = d.y; //t.attr('y');
            
            // console.log('table transform: ', d3.select(this).attr('transform'));
            let transform = d3.select(this).attr('transform');
            if(!transform){return;}
            let coords = transform.slice(10, -1);
            let coordsXY = coords.split(',');
            let dx = Number(coordsXY[0]);
            let dy = Number(coordsXY[1]);
            console.log('table drag done: ', d.id, dx, dy);
            Maestro.Tables.MoveTablePosition(d.id, dx, dy);
        }

        var editCornerPoint = d3.behavior.drag()
                                            .origin(function() { 
                                                    var t = d3.select(this);
                                                    return {x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
                                                            y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]};
                                                })
                                            .on("dragstart", corner_dragstarted)
                                            .on("drag", corner_dragged)
                                            .on("dragend", corner_dragended);
        function corner_dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();

            // console.log('d3 element: ', this);
            // d3.select(this).classed("dragging", true);
        }

        function corner_dragged(d) {
            // console.log('d3 event: ', d3.event);
            
            // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            // d3.select(this).attr("transform", "translate(" + d3.event.dx + ", " + d3.event.dy + ")");
            d3.select(this).attr("transform", function(d,i){return "translate(" + [ d3.event.x, d3.event.y ] + ")"});
        }

        function corner_dragended(d) {
            // d3.select(this).classed("dragging", false);
            // console.log('d var: ', d);
            // console.log('drag event: ', d3.event.x, d3.event.y);
            // let t = d3.select(this);
            // let x_new = d.x; //t.attr('x');
            // let y_new = d.y; //t.attr('y');
            
            // console.log('table transform: ', d3.select(this).attr('transform'));
            let transform = d3.select(this).attr('transform');
            if(!transform){return;}
            let coords = transform.slice(10, -1);
            let coordsXY = coords.split(',');
            let dx = Number(coordsXY[0]);
            let dy = Number(coordsXY[1]);
            console.log('corner drag done: ', d.id, dx, dy);
            let newPoint = {dx: dx, dy: dy, id: d.id};
            Maestro.Tables.Floor.MoveCornerPoint(newPoint, poly, d.section);
        }

        d3.selection.prototype.moveToFront = function() {  
          return this.each(function(){
            this.parentNode.appendChild(this);
          });
        };

        d3.selection.prototype.moveToBack = function() {  
            return this.each(function() { 
                var firstChild = this.parentNode.firstChild; 
                if (firstChild) { 
                    this.parentNode.insertBefore(this, firstChild); 
                } 
            });
        };

        let location = Maestro.Business.getLocation();
        let floorLayoutSections = location.floorLayoutSections;
        // console.log('floorLayoutSections: ', floorLayoutSections);
        let poly = [];
        let section = 0;

        if(!!floorLayoutSections){
            if(!!floorLayoutSections[section].vertices){
                let corners = location.floorLayoutSections[section].vertices;
                // console.log('corners: ', corners);
                poly = _.map(corners, function(point, index){
                    // console.log('processing point: ', point);
                    let newPoint = point;               
                    newPoint.id = index;
                    newPoint.section = section;
                    return newPoint;
                });
            } else {
                poly = [{x:20, y:20, id:0, section: 0},
                    {x:800,y:20, id:1, section: 0},
                    {x:800,y:600, id:2, section: 0},
                    {x:20,y:600, id:3, section: 0},
                    {x:20,y:450, id:4, section: 0},
                    {x:70,y:450, id:5, section: 0},
                    {x:70,y:150, id:6, section: 0},
                    {x:20,y:150, id:7, section: 0}];
            }
        } else {
            poly = [{x:20, y:20, id:0, section: 0},
                    {x:800,y:20, id:1, section: 0},
                    {x:800,y:600, id:2, section: 0},
                    {x:20,y:600, id:3, section: 0},
                    {x:20,y:450, id:4, section: 0},
                    {x:70,y:450, id:5, section: 0},
                    {x:70,y:150, id:6, section: 0},
                    {x:20,y:150, id:7, section: 0}]; 
        }

        // poly = [{x:20, y:20, id:0, section: 0},
        //     {x:800,y:20, id:1, section: 0},
        //     {x:800,y:600, id:2, section: 0},
        //     {x:20,y:600, id:3, section: 0},
        //     {x:20,y:450, id:4, section: 0},
        //     {x:70,y:450, id:5, section: 0},
        //     {x:70,y:150, id:6, section: 0},
        //     {x:20,y:150, id:7, section: 0}]; 

        // console.log('new point set from location: ', poly);

        var roomLayout = container.append('g');

        var defs = roomLayout.append('svg:defs');

        let defaultTilesSet = Maestro.Tables.Floor.getFloorTileOptions();
        let floorTileURL = defaultTilesSet[1].url;

        if(!!location.floorLayoutSections){
            if(!!location.floorLayoutSections[section]){
                floorTileURL = location.floorLayoutSections[section].floorTile ? location.floorLayoutSections[section].floorTile.url : defaultTilesSet[0].url;
            }
        }


        defs.append("svg:pattern")
            .attr("id", "floor-tile")
            .attr("width", 100)
            .attr("height", 100)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", floorTileURL)
            .attr("width", 100)
            .attr("height", 100)
            .attr("x", 0)
            .attr("y", 0);

        var roomWalls = roomLayout.selectAll("polygon")
                                    .data([poly])
                                    .enter().append("polygon")
                                    .attr("points",function(d) { 
                                        return d.map(function(d) {
                                            return [d.x, d.y];
                                        }).join(" ");
                                    })
                                    .attr("stroke","black")
                                    .attr("fill", "none")
                                    .attr("stroke-width",2)
                                    .style("fill", "url(#floor-tile)");

        var roomCorners = roomLayout.append("g");

        var cornerPoints = roomCorners.selectAll("circle")                          
                                        .data(poly)
                                        .enter();
        
        cornerPoints.append("circle")
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
                    .attr("r", function (d) { return 10; })
                    .attr("id", function (d, index) { return "corner-"+index; })
                    .style("fill", "lightblue")
                    .style("stroke", "green")
                    .call(editCornerPoint);

        //Add circles to the svgContainer
        var tablesLayer = container.append('g');

        var tableNode = tablesLayer.selectAll("circle")
                        .data(circleData)
                        .enter();
        
        var table = tableNode.append('g')
                                .on('click', template.handleTableSelect)
                                .call(editTablePosition);

        table.append("circle")
            .attr("cx", function (d) { return d.cx; })
            .attr("cy", function (d) { return d.cy; })
            .attr("r", function (d) { return d.radius; })
            .attr("id", function (d, index) { return "table-" + index; })
            .style("fill", function (d) { 
                let table = template.editTable.get();
                if(!!table){
                    if(d.id == table._id){
                        return 'lightsteelblue';
                    }
                }
                return 'white'; 
            })
            .style("stroke", function(d) {
                return 'grey';
            });
        
        table.append("text")
                .attr("x", function(d) { return d.cx - 20; })
                .attr("y", function(d) { return d.cy + 10; })
                .text( function (d) { return d.label; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "black");
        
        // container.moveToBack();
        roomLayout.moveToBack();
        gridLines.moveToBack();

        // tablesLayer.moveToFront();

        // xLines.moveToBack();
        // yLines.moveToBack();

    };
        
    template.editTable = new ReactiveVar();

    template.handleTableSelect = function (data, index){

        let table = Maestro.Tables.GetSpecificTable(data.id);

        // template.selectedTable.set(table);
        // Template.instance().svgTableSelected.set(table);
        template.editTable.set(table);
        // console.log(Template.instance().svgTableSelected.get());
    };

	this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        Template.instance().subscribe('tables-location-specific', businessId, locationId);
    });

    // template = Template.instance();
    // template.editTable = new ReactiveVar();
});

Template.LayoutEditor.onRendered(function() {	
    let template = this;

	this.autorun(function(){
        if(Template.instance().subscriptionsReady()){
            template.initiateFloorPlan(Template.instance());
        }
    });

	// $('.collapsible').collapsible();
	$('.carousel').carousel();
});

Template.LayoutEditor.helpers({
 	'getTablesList': function(){
        return Maestro.Tables.GetTablesForLocation();
    },

    'getFloorTileOptions': function(){
    	return Maestro.Tables.Floor.getFloorTileOptions();
    },

    'getEditTable': function(){
    	return Template.instance().editTable.get();
    }
});

Template.LayoutEditor.events({
	'click .editTable': function(event, template){
		template.editTable.set(this);
		$('#editTableLabelField').val("");
		console.log(template.editTable.get());
	},

	'click .selectFloorTile': function(event, template){
		let floorTile = this;
		let section = 0;
		Maestro.Tables.Floor.selectFloorTile(floorTile, section)
	},

	'keyup #editTableLabelField': function(event, template){
		let label = $('#editTableLabelField').val();
		let table = template.editTable.get();
		Maestro.Tables.setTableLabel(table._id, label);
		template.editTable.set(Maestro.Tables.GetSpecificTable(table._id))
	},

	'click .editSeatsDown': function(event, template){
		let table = template.editTable.get();
		Maestro.Tables.setTableDefaultSeats(table._id, table.defaultSeats - 1);
		template.editTable.set(Maestro.Tables.GetSpecificTable(table._id));
	},

	'click .editSeatsUp': function(event, template){
		let table = template.editTable.get();
		Maestro.Tables.setTableDefaultSeats(table._id, table.defaultSeats + 1);
		template.editTable.set(Maestro.Tables.GetSpecificTable(table._id));
	},
});

