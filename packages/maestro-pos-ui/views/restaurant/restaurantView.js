Maestro.Templates.RestaurantView = "RestaurantView";

//will need to move the SVGTable Layout functions out later
Maestro.POS.SVGTableLayout = {};
Maestro.POS.SVGTableLayout.clearSVGTableSelect = function(template){
    template.clearSVGTableSelect();
};
///////////////////

Template.RestaurantView.onCreated(function() {
    var template = this;
    
    template.newCustomerId = new ReactiveVar();
    template.svgTableSelected = new ReactiveVar();

    template.timer;

    template.initiateFloorPlan = function(template){
        $('#tables-layout').empty();
       
        // var existingTables = Maestro.Tables.GetTablesForLocation();
        // var circleData = [];
        // // console.log('redrawing svg');

        // _.each(existingTables, function(table, index){
        //     let tablex, tabley;

        //     if(!!table.position){
        //         tablex = table.position.x || 0;
        //         tabley = table.position.y || 0;
        //     } else {
        //         tablex = 0;
        //         tabley = 0;
        //     }
        //     circleData.push({"cx":  tablex, "cy": tabley, "radius": 50, "color" : "white", "outline": "black", "label": table.tableLabel || "A#", "id": table._id});
        //     // circleData.push({"cx":  100, "cy": 100, "radius": 50, "color" : "white", "outline": "black", "label": table.tableLabel || "A#", "id": table._id});
        // });

        // console.log('tables: ', existingTables);

        let circleData = Maestro.Tables.getAllTablesForSVG();
        let circleData_Available = _.where(circleData, {inUse: false});
        let circleData_inUse = _.where(circleData, {inUse: true});

        var svgWidth = $('#tables-layout').width(),
            svgHeight = $('#tables-layout').height();

        var zoom = d3.behavior.zoom()
            .scaleExtent([0.25, 2])
            .on("zoom", zoomed);

        var svg = d3.select("#tables-layout").append("svg")
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

        if(!!initialTranslate && !!initialScale){
            container.attr("transform", "translate(" + initialTranslate + ")scale(" + initialScale + ")");
        }

        // var xLines = container.append("g")
        //                         .attr("class", "x axis")
        //                       .selectAll("line")
        //                         .data(d3.range(0, svgWidth*2, 10))
        //                       .enter().append("line")
        //                         .attr("x1", function(d) { return d; })
        //                         .attr("y1", 0)
        //                         .attr("x2", function(d) { return d; })
        //                         .attr("y2", svgHeight*2);

        // var yLines = container.append("g")
        //                         .attr("class", "y axis")
        //                       .selectAll("line")
        //                         .data(d3.range(0, svgHeight*2, 10))
        //                       .enter().append("line")
        //                         .attr("x1", 0)
        //                         .attr("y1", function(d) { return d; })
        //                         .attr("x2", svgWidth*2)
        //                         .attr("y2", function(d) { return d; });


        function zoomed() {
          container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
          initialTranslate = d3.event.translate;
          initialScale = d3.event.scale;
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
            // console.log('table drag done: ', d.id, dx, dy);
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
            // console.log('corner drag done: ', d.id, dx, dy);
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

        let location = Maestro.Business.getLocation() || {};
        let floorLayoutSections = location.floorLayoutSections;
        // console.log('floorLayoutSections: ', floorLayoutSections);
        let poly = [];
        let section = 0;

        if(!!floorLayoutSections){
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

        //Add circles to the svgContainer
        var tablesLayer_Available = container.append('g');

        var tableNode_Available = tablesLayer_Available.selectAll("circle")
                        .data(circleData_Available)
                        .enter();

        var table_Available = tableNode_Available.append('g')
                                .on('click', template.handleTableSelect)
                                .call(editTablePosition);

        table_Available.append("circle")
            .attr("cx", function (d) { return d.cx; })
            .attr("cy", function (d) { return d.cy; })
            .attr("r", function (d) { return d.radius; })
            .attr("id", function (d, index) { return "table-" + index; })
            .style("fill", function (d) { 
                let table = template.svgTableSelected.get();
                if(!!table){
                    if(d.id == table._id){
                        return 'lightsteelblue';
                    }
                }
                return d.color; 
            })
            .style("stroke", function(d) {
                return 'grey';
            });
        
        table_Available.append("text")
                .attr("x", function(d) { 
                    return d.cx - ((d.label.length * 20)/4); 
                })
                .attr("y", function(d) { return d.cy + 5; })
                .text( function (d) { return d.label; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "black");

        var tablesLayer_inUse = container.append('g');

        var tableNode_inUse = tablesLayer_inUse.selectAll("circle")
                        .data(circleData_inUse)
                        .enter();

        var table_inUse = tableNode_inUse.append('g')
                            .on('click', template.handleInUseTableSelect)
                            .call(editTablePosition);

        table_inUse.append("circle")
            .attr("cx", function (d) { return d.cx; })
            .attr("cy", function (d) { return d.cy; })
            .attr("r", function (d) { return d.radius; })
            .attr("id", function (d, index) { return "table-" + index; })
            .style("fill", function (d) { 
                let table = template.svgTableSelected.get();
                if(!!table){
                    if(d.id == table._id){
                        return 'lightsteelblue';
                    }
                }
                return d.color; 
            })
            .style("stroke", function(d) {
                return 'grey';
            });
        
        table_inUse.append("text")
                .attr("x", function(d) { 
                    return d.cx - ((d.label.length * 20)/4); 
                })
                .attr("y", function(d) { return d.cy + 5; })
                .text( function (d) { return d.label; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "black");
        
        roomLayout.moveToBack();
    };

    template.handleTableSelect = function (data, index){
        let table = Maestro.Tables.GetSpecificTable(data.id);
        template.svgTableSelected.set(table);
    };

    template.handleInUseTableSelect = function (data, index){
        FlowRouter.go("/orders/openOrders/select/" + data.inUseOrderId);
    };

    template.clearSVGTableSelect = function (){
        template.svgTableSelected.set();
        // console.log('svg table cleared');
    };

    Maestro.POS.initializeOrder(template);

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        Template.instance().subscribe('tables-location-specific', businessId, locationId);
    });

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        
        let todayDate = new Date();
        todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0,0,0,0);

        Template.instance().subscribe('orders-incomplete-atLocation-today', businessId, locationId, todayDate);
    });

    this.autorun(function(){
        // console.log('table select start');
        if(!!template.selectedTableId.get() && template.subscriptionsReady()){
            let table = Maestro.Tables.GetSpecificTable(template.selectedTableId.get());
            template.selectedTable.set(table);
            template.svgTableSelected.set(table);
            template.selectedSeat.set({
                seatNumber: 1,
                tableId: table._id
            });
            template.orderType.set("DINEIN");
            template.orderInformation.orderType = "DINEIN";            
            template.selectedTableId.set(null);
        }
    });

});


Template.RestaurantView.onRendered(function() {    
    var template = this;

    $('#checkout-tabs').tabs();
    $('#checkout-tabs-bottom').tabs();
    
    $('#tables-product-customer-loyalty-tabs').tabs({ 
        onShow: function(tab) {
                    // console.log('tab -- : ', tab.selector);
                    if( tab.selector == "#order-tables"){
                        template.initiateFloorPlan(template);
                        // console.log('redrawn');
                    } 
                } 
    });
    
    $("#order-checout-balance-tabs").tabs({
        onShow: function(tab){
            if(tab.selector == "#orderDetailsTab"){
                if(!!UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE)){
                    template.rememberOrderType.set(true);
                }

                if(UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE) == "DELIVERY" ||
                    UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE) == "TAKEOUT"){
                    template.orderType.set(UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE));
                }
            
            }
        }
    });

    this.autorun(function(){
        if(template.newCustomerId.get()){
            let customerId = template.newCustomerId.get();
            Template.instance().orderCustomer.set(Customers.findOne({_id: customerId}));
            template.newCustomerId.set();
        }
    });

    this.autorun(function(){
        if(Template.instance().subscriptionsReady()){
            template.initiateFloorPlan(Template.instance());
        }
    });

    this.autorun(function(){
        if(!!template.svgTableSelected.get()){
            Template.instance().selectedTable.set(template.svgTableSelected.get());
            Template.instance().selectedSeat.set({
                seatNumber: 1,
                tableId: this._id
            });
            template.orderType.set("DINEIN");
            template.orderInformation.orderType = "DINEIN";
        }
    });

    Maestro.POS.Navigation.goToStartTabs(template);
    Maestro.POS.Tools.checkForEditCheckoutMode(template);
});

Template.RestaurantView.helpers(_.extend(Maestro.POS.Views.restaurantHelpers, {
    'candidateOrderItem': function () {
        return Template.instance().candidateOrderItem.get();
    },

    'isOrderEditMode': function(){
        // console.log('edit mode: ',Template.instance().inOrderEditMode.get());
        return Template.instance().inOrderEditMode.get();
    },

    'isCheckoutMode': function(){
        return Template.instance().checkoutMode.get();
    },

    'getEditOrderNumber': function(){
        let dailyOrderNumber = (Template.instance().editOrder.get() || {}).dailyOrderNumber;
        if (dailyOrderNumber < 10){
            return "#00"+String(dailyOrderNumber);
        } else if (dailyOrderNumber <100){
            return "#0"+String(dailyOrderNumber);
        } else {
            return "#"+String(dailyOrderNumber);
        }
    },

    'getTablesList': function(){
        return Maestro.Tables.GetTablesForLocation();
    },

    'getSelectedTable': function(){
        return Template.instance().selectedTable.get();
    },

    'getTableSeats': function(){
        let table = Template.instance().selectedTable.get();
        if (!!table){
            let seats = table.defaultSeats;
            let seatsObj = []
            for (i = 1; i <= seats; i++){
                seatsObj.push({
                    seatNumber : i,
                    tableId : table._id
                });
            }
            return seatsObj;
        } else {
            return [];
        }
    },

    'isSeatSelected': function(seatNumber){
        let seat = Template.instance().selectedSeat.get();
        
        if(!!seat){
            if(seatNumber == seat.seatNumber){
                return true;
            }
        }
    },

    'getSeatChipStyle': function(seatNumber){
        let seat = Template.instance().selectedSeat.get();

        if(!!seat){
            if(seatNumber == seat.seatNumber){
                return "background-color: lightblue; min-height:60px;";
            }
        }

        return "background-color: lightgrey;";
    },

    'getSelectedSeat': function(){
        return Template.instance().selectedSeat.get();
    },

    'selectedCandidateSize': function () {
        let candidateOrderItem = Template.instance().candidateOrderItem.get();
        let candidateOrderItemSize = candidateOrderItem.size;
        if(candidateOrderItemSize && candidateOrderItemSize.code) {
            return this.code === candidateOrderItemSize.code;
        }
        return false;
    },

    'alphabet': function(){
        var upperAlphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V','W','X','Y','Z'];
        var upperAlphabet = [];

        for (i = 0; i<26; i++){
            upperAlphabet.push({letter: upperAlphabetArray[i]});
        }

        return upperAlphabet;
    },

    isLocationSelected: function(){
        let locationID = Maestro.Client.locationId();
        if (!locationID){
            Materialize.toast("Select Location", 4000);
        }
    },

    displaySizeLine: function(item){
        if(item){
            if(item.quantity == 1 && item.addOns.length==0 && item.product.sizes.length ==1){
                return false;
            }
        }
        return true;
    },

    splitByTableSelected: function(){
        if(Template.instance().orderSplitType.get()=="TABLE"){
            return true;
        }
        return false;
    },

    splitBySeatSelected: function(){
        if(Template.instance().orderSplitType.get()=="SEATS"){
            return true;
        }
        return false;
    },

    splitByEqualAmountSelected: function(){
        if(Template.instance().orderSplitType.get()=="EQUALLY"){
            return true;
        }
        return false;
    },

    splitByCustomGroupSelected: function(){
        if(Template.instance().orderSplitType.get()=="CUSTOM"){
            return true;
        }
        return false;
    },

    allOptionsForEqualOrderSplits: function(){
        let allOptions = [];
        let defaultSeats = Template.instance().selectedTable.get().defaultSeats;
        defaultSeats = defaultSeats < 2 ? 2 : defaultSeats;

        for(i=1; i<= defaultSeats; i++){
            allOptions.push(i);
        }

        allOptions = _.map(allOptions, function(num){ return {num: num}; });

        return allOptions;
    },

    allSeatsForCheckout: function(){
        return Template.instance().seatGrouping.get();
    },

    thisSeatBeingCheckedOut: function(thisSeatNumber){
        let selectedSeatNumber = Template.instance().checkoutSeatSelected.get();
        if(selectedSeatNumber == thisSeatNumber){
            return true;
        }
        return false;
    },

    allSeatsCheckedOut: function(){
        let seatGroups = Template.instance().seatGrouping.get();
        let allCheckedOut = true;
        _.each(seatGroups, function(seatGroup){
            if(!seatGroup.splitOrderId){
                allCheckedOut = false;
            }
        });
        return allCheckedOut;
    },

    thisSeatIsCheckedOut: function(){
        if(!!this.splitOrderId){
            return true;
        }
        return false;
    },

    splitByThisNumber: function(){
        let number = this.num;
        if(Template.instance().orderSplitEquallyBy.get() == number){
            return true;
        }
        return false;
    },

    splitThisAmountEqually: function(amount){
        return amount/Template.instance().orderSplitEquallyBy.get();
    },

    splitEquallyBy: function(){
        return Template.instance().orderSplitEquallyBy.get();
    },

    splitEquallyByLessOne: function(){
        return Template.instance().orderSplitEquallyBy.get() - 1;
    },

    getDefinedGroups: function(){
        return Template.instance().definedGroups.get();
    },

    nextGroupDefinition: function(){
        let ungroupedSeats = Template.instance().ungroupedSeats.get() || [];
        if(ungroupedSeats.length){
            let definedGroups = Template.instance().definedGroups.get();
            let nextGroup = !!definedGroups ? definedGroups.length + 1 : 1;
            return {groupNumber: nextGroup};
        }
        return null;
    },

    remainingUngroupedSeats: function(){
        return Template.instance().ungroupedSeats.get();
    },

    thisSeatIsSelectedForGroup: function(){
        let seatNumber = this.seatNumber;
        let thisSeat = _.findWhere(Template.instance().ungroupedSeats.get(), {seatNumber: seatNumber});
        return !!thisSeat ? thisSeat.selectedForGroup : false;
    },

    thisItemOptionsExpanded: function(){
        if(!!this.optionsExpanded){
            return true;
        }
        return false;
    },

    anyItemOptionsExpanded: function(){
        let template = Template.instance();
        let anyExpanded = Maestro.POS.OrderItems.getAllSeatItemsWithAttr(template, null, {optionsExpanded: true}) || [];
        if(anyExpanded.length > 0){
            return true;
        }
        return false;
    },

    thisItemOptionsExpandAddons: function(){
        if(this.optionsExpandType == "ADDONS"){
            return true;
        }
        return false;
    },

    thisItemOptionsExpandSubstitutions: function(){
        if(this.optionsExpandType == "SUBSTITUTIONS"){
            return true;
        }
        return false;
    },

    thisItemOptionsExpandNotes: function(){
        if(this.optionsExpandType == "NOTES"){
            return true;
        }
        return false;
    },

    thisItemOptionsExpandDiscounts: function(){
        if(this.optionsExpandType == "DISCOUNTS"){
            return true;
        }
        return false;
    },

    itemQuantityMoreThanOne: function(){
        if(this.quantity > 1) {return true;}
        return false;
    },

    // showOrderDetails: function(){
    //     return true;
    // }
}));

Template.RestaurantView.events(_.extend(Maestro.POS.Views.restaurantEvents, {
    'click .showPreviousOrder': function(event, template){
        Tracker.flush();
        template.openRecentOrderSummaryPopup();
        template.openRecentOrderSummaryUnderlay();
        // $('#prior-order-review-button').sideNav('show');
        // console.log('opening summary');
    },

    'click .goToOrderTab': function(event, template){
        if(template.orderSplitType.get()=="SEATS" || template.orderSplitType.get()=="CUSTOM"){
            Maestro.POS.OrderItems.restoreFromCache(template);
        }
        template.orderSplitType.set("TABLE");

        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
    },

    'click .goToNormalCheckoutTab': function(event, target){
        $('ul.tabs').tabs('select_tab', 'checkoutTab');
    },

    'click .selectTable': function(event, template){
        Template.instance().selectedTable.set(this);
        Template.instance().selectedSeat.set({
            seatNumber: 1,
            tableId: this._id
        });
        // console.log('auto select seat: ', Template.instance().selectedSeat.get());
    },

    'click .selectSeat': function(event, target){
        Template.instance().selectedSeat.set(this);
    },

    'click .addSeat': function(event, target){
        let table = Template.instance().selectedTable.get();
        table.defaultSeats += 1;
        Template.instance().selectedTable.set(table);
    },

    'click .increase-item-quantity':function(event, template){
        Maestro.POS.OrderItems.increaseQuantity(template, this, 1);
        Maestro.POS.OrderItems.setItemAttr(template, this, {sentToKitchen: false});
        Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
    },

    'blur .enterLargeQuantity': function(event, template){
        let largeQuantity = Number(document.getElementById(this._id+"_large_quantity").value);
        // console.log(largeQuantity);
        if(!(largeQuantity > 0 )){ largeQuantity = 1;}
        if(largeQuantity % 1 != 0){Materialize.toast("Must be whole number", 1000, "rounded red");}
        largeQuantity = Math.floor(largeQuantity);

        Maestro.POS.OrderItems.setQuantity(template, this, largeQuantity);
        Maestro.POS.OrderItems.setItemAttr(template, this, {sentToKitchen: false});
        Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);

        // Maestro.POS.UI.ToggleLargeQuantityField(this._id);
    },

    'click .decrease-item-quantity': function(event, template){
        let orderItem = this;
        
        if(!orderItem){return}

        if(orderItem.quantity > 1){
            Maestro.POS.OrderItems.increaseQuantity(template, this, -1);
            Maestro.POS.OrderItems.setItemAttr(template, this, {sentToKitchen: false});
            Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);  
        }
    },

    'click .group-item-select': function(event, template){
        template.selectedCandidateGroup.set(this);
    },

    'click .deselect-group-item': function(event, template){
        template.selectedCandidateGroup.set();
    },

    'click .product-collapse': function(event, template){
        template.expandedProduct.set();
    },

    'click .product-item-select': function (event, template) {
        event.preventDefault();
        let candidateProduct = this;
        Maestro.POS.OrderItems.productClick(template, candidateProduct);
    },

    'click .product-size-select': function (event, template) {
        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.size = this;

        let key = candidateOrderItem.size.code + "-" + candidateOrderItem.product._id;
        // let existingOrderItem = template.orderItems.get(key);
        let existingOrderItem = Maestro.POS.OrderItems.getItem(template, key);

        if(existingOrderItem) {
            let oldCandidateItemQuantity = candidateOrderItem.quantity;
            candidateOrderItem = existingOrderItem;
            candidateOrderItem.quantity = oldCandidateItemQuantity;
        }

        template.candidateOrderItem.set(candidateOrderItem);

        if(candidateOrderItem && candidateOrderItem.size) {
            Maestro.POS.Tools.selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
            Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
        }

    },

    'click .selectCustomerSearchBox': function(event, template){
        if(!template.orderCustomer.get()){
            Maestro.POS.UI.FocusOnCustomerSearchField();
        }
    },

    'click .product-add-on-select': function(event, template){
        Maestro.POS.OrderItems.productAddonSelect(template, this);
    },

    'click .closeSelectedAddOnChip': function(event, template){
        Maestro.POS.OrderItems.removeSelectedProductAddon(template, this);
    },

    'click #splitByTable': function(event, template){
        template.orderSplitType.set("TABLE");
    },

    'click #splitBySeats': function(event, template){
        template.orderSplitType.set("SEATS");
        Maestro.POS.OrderItems.initializeSeatSplit(template);
    },

    'click #splitByEqualAmount': function(event, template){
        template.orderSplitType.set("EQUALLY");
    },

    'click #splitByCustomGroup': function(event, template){
        template.orderSplitType.set("CUSTOM");
        Maestro.POS.OrderItems.initializeGroupSplit(template);
    },

    'click .chooseThisSplitType': function(event, template){
        let number = this.num;
        template.orderSplitEquallyBy.set(number);
    },

    'click .checkoutThisSeat': function(event, template){
        let seat = this.seatNumber;
        template.checkoutSeatSelected.set(seat);
        Maestro.POS.OrderItems.isolateSeatItemsForCheckout(template);
    },

    'click .cancelSplit': function(event, template){
        Maestro.POS.OrderItems.restoreFromCache(template);
    },

    'click .toggleSeatSelectionToGroup': function(event, template){
        let seatNumber = this.seatNumber;

        Maestro.POS.OrderItems.toggleSeatSelectionToGroup(template, seatNumber);
    },

    'click #thisGroupDone': function(event, template){
        Maestro.POS.OrderItems.thisGroupDone(template);
    },

    'click .printRecentlyCompletedOrder': function(event, template){
        let order = this;
        // console.log(order);
        Maestro.Order.PrintOrderReceipt(order);
    },

}));