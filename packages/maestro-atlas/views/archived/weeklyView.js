Maestro.Templates.WeeklyView = "WeeklyView";

var weeklyDateReact = new ReactiveVar();
var weeklyDate = new Date();

weeklyDate = new Date(weeklyDate.getFullYear(), weeklyDate.getMonth(), weeklyDate.getDate());
weeklyDate.setDate(weeklyDate.getDate()-weeklyDate.getDay());

weeklyDateReact.set(weeklyDate);

var nextWeeklyDate = new Date(weeklyDate);
nextWeeklyDate.setDate(nextWeeklyDate.getDate()+7);

var getWeeklyBarChart = function(divId){
    var pageContainer = document.getElementById(divId);
    pageContainer.innerHTML="";

    var barChartContainer = document.createElement("div");
    var barChartId = "weeklyBarChartContainer";

    barChartContainer.setAttribute("id", barChartId);
    pageContainer.appendChild(barChartContainer);

    // var ordersObj = Orders.find({createdAt : {$gt: weeklyDate, $lt: nextWeeklyDate}}).fetch();
    var ordersObj = Maestro.Atlas.Tally.GetOrders(weeklyDate, nextWeeklyDate);

    var dataObj = [];

    var labelText;

    totalOrders = Maestro.Atlas.Tally.TotalOrderSales(weeklyDate, nextWeeklyDate);

    if(totalOrders == 0){
        Maestro.Atlas.BarChart(barChartId,[{label:"No Orders", total:0}]);
    } else {
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        for (i=0; i < 7; i++){
            dataObj.push(
                    {label: weekdays[i], total: 0.0}
                );
        }

        var orderDay, orderDate, orderTotal;

        for (i = 0; i < ordersObj.length; i++){
            orderDate = new Date(ordersObj[i].createdAt);
            orderDay = orderDate.getDay();
            orderTotal = ordersObj[i].subtotals.total;
            dataObj[orderDay].total += Math.round(orderTotal);
        }

        Maestro.Atlas.BarChart(barChartId,dataObj);
    }
};

Template.WeeklyView.onRendered(function(){
    getWeeklyBarChart('weeklyBarChart');

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});

Template.WeeklyView.helpers({
    getWeeklyOrdersTally : function(){
        weeklyDate = new Date(weeklyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderCount(weeklyDate, nextWeeklyDate);
    },

    getWeeklySalesTally : function(){
        weeklyDate = new Date(weeklyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderSales(weeklyDate, nextWeeklyDate).toFixed(2);
    },

    getSelectedWeeklyDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        weeklyDate = new Date(weeklyDateReact.get());

        var nextWeeklyDateTemp = new Date(nextWeeklyDate);
        nextWeeklyDateTemp.setDate(nextWeeklyDateTemp.getDate()-1);

        var labelString = weekdays[weeklyDate.getDay()]+", " + months[weeklyDate.getMonth()] + " " + weeklyDate.getDate() + " to " +
            weekdays[nextWeeklyDateTemp.getDay()]+", " + months[nextWeeklyDateTemp.getMonth()] + " " + nextWeeklyDateTemp.getDate() ;

        return labelString;
    },

    getWeeklyProductsTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.ProductsTable(weeklyDateReact.get(), nextWeeklyDate);
    },

    getDailyCategoryTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.CategoryTable(weeklyDateReact.get(), nextWeeklyDate);
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    refreshWeeklyGraph: function(){
        if(weeklyDateReact.get() || Maestro.Business.getLocationId()){
            if(document.getElementById('weeklyBarChart')){
                getWeeklyBarChart('weeklyBarChart');
            }
        }
    },

});

Template.WeeklyView.events({
    'click #nextWeek': function(event, target){
        weeklyDate = new Date(weeklyDateReact.get());

        weeklyDate.setDate(weeklyDate.getDate()+7);
        nextWeeklyDate.setDate(nextWeeklyDate.getDate()+7);
        weeklyDateReact.set(weeklyDate);

        // getWeeklyBarChart('weeklyBarChart');
    },

    'click #previousWeek': function(event, target){
        weeklyDate = new Date(weeklyDateReact.get());

        weeklyDate.setDate(weeklyDate.getDate()-7);
        nextWeeklyDate.setDate(nextWeeklyDate.getDate()-7);

        weeklyDateReact.set(weeklyDate);

        // getWeeklyBarChart('weeklyBarChart');
        
    },

    'click .forceRefreshWeekly': function(event, target){
        getWeeklyBarChart('weeklyBarChart');
    }
    

});