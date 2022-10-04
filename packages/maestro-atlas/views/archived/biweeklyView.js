Maestro.Templates.BiweeklyView = "BiweeklyView";

var biweeklyDateReact = new ReactiveVar();
var biweeklyDate = new Date();

biweeklyDate = new Date(biweeklyDate.getFullYear(), biweeklyDate.getMonth(), biweeklyDate.getDate());
biweeklyDate.setDate(biweeklyDate.getDate()-biweeklyDate.getDay());

biweeklyDateReact.set(biweeklyDate);

var nextBiweeklyDate = new Date(biweeklyDate);
nextBiweeklyDate.setDate(nextBiweeklyDate.getDate()+14);

var getBiweeklyBarChart = function(divId){
    var pageContainer = document.getElementById(divId);
    pageContainer.innerHTML="";

    var barChartContainer = document.createElement("div");
    var barChartId = "biweeklyBarChartContainer";

    barChartContainer.setAttribute("id", barChartId);
    pageContainer.appendChild(barChartContainer);

    // var ordersObj = Orders.find({createdAt : {$gt: biweeklyDate, $lt: nextBiweeklyDate}}).fetch();
    var ordersObj = Maestro.Atlas.Tally.GetOrders(biweeklyDate, nextBiweeklyDate);

    var dataObj = [];

    var labelText;

    totalOrders = Maestro.Atlas.Tally.TotalOrderSales(biweeklyDate, nextBiweeklyDate);

    if(totalOrders == 0){
        Maestro.Atlas.BarChart(barChartId,[{label:"No Orders", total:0}]);
    } else {
        var startDate = new Date(biweeklyDate);
        var biweekLookup = [startDate.getDate()];
        for (i=1; i<14; i++){
            biweekLookup.push(startDate.getDate(startDate.setDate(startDate.getDate()+1)));
        }

        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        for (i=0; i < 14; i++){
            dataObj.push(
                    {label: biweekLookup[i], total: 0.0}
                );
        }

        var orderDay, orderDate, orderTotal;

        for (i = 0; i < ordersObj.length; i++){
            orderDate = new Date(ordersObj[i].createdAt);
            orderDay = orderDate.getDate();
            orderDay = biweekLookup.indexOf(orderDay);
            orderTotal = ordersObj[i].subtotals.total;
            dataObj[orderDay].total += Math.round(orderTotal);
        }

        Maestro.Atlas.BarChart(barChartId,dataObj);
    }
};

Template.BiweeklyView.onRendered(function(){
    getBiweeklyBarChart('biweeklyBarChart');

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});

Template.BiweeklyView.helpers({
    getBiweeklyOrdersTally : function(){
        biweeklyDate = new Date(biweeklyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderCount(biweeklyDate, nextBiweeklyDate);
    },

    getBiweeklySalesTally : function(){
        biweeklyDate = new Date(biweeklyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderSales(biweeklyDate, nextBiweeklyDate).toFixed(2);
    },

    getSelectedBiweeklyDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        biweeklyDate = new Date(biweeklyDateReact.get());

        var nextBiweeklyDateTemp = new Date(nextBiweeklyDate);
        nextBiweeklyDateTemp.setDate(nextBiweeklyDateTemp.getDate()-1);

        var labelString = weekdays[biweeklyDate.getDay()]+", " + months[biweeklyDate.getMonth()] + " " + biweeklyDate.getDate() + " to " +
            weekdays[nextBiweeklyDateTemp.getDay()]+", " + months[nextBiweeklyDateTemp.getMonth()] + " " + nextBiweeklyDateTemp.getDate() ;

        return labelString;
    },

    getBiweeklyProductsTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.ProductsTable(biweeklyDateReact.get(), nextBiweeklyDate);
    },

    getDailyCategoryTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.CategoryTable(biweeklyDateReact.get(), nextBiweeklyDate);
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    refreshBiWeeklyGraph: function(){
        if(biweeklyDateReact.get() || Maestro.Business.getLocationId()){
            if(document.getElementById('biweeklyBarChart')){
                getBiweeklyBarChart('biweeklyBarChart');
            }
        }
    },

});

Template.BiweeklyView.events({
    'click #nextBiweek': function(event, target){
        biweeklyDate = new Date(biweeklyDateReact.get());

        biweeklyDate.setDate(biweeklyDate.getDate()+14);
        nextBiweeklyDate.setDate(nextBiweeklyDate.getDate()+14);
        biweeklyDateReact.set(biweeklyDate);

        // getBiweeklyBarChart('biweeklyBarChart');
    },

    'click #previousBiweek': function(event, target){
        biweeklyDate = new Date(biweeklyDateReact.get());

        biweeklyDate.setDate(biweeklyDate.getDate()-14);
        nextBiweeklyDate.setDate(nextBiweeklyDate.getDate()-14);

        biweeklyDateReact.set(biweeklyDate);

        // getBiweeklyBarChart('biweeklyBarChart');
        
    },

    'click .forceRefreshBiweekly': function(event, target){
        getBiweeklyBarChart('biweeklyBarChart');
    }
    

});