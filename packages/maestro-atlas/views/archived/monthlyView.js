Maestro.Templates.MonthlyView = "MonthlyView";

var monthlyDateReact = new ReactiveVar();
var monthlyDate = new Date();

monthlyDate = new Date(monthlyDate.getFullYear(), monthlyDate.getMonth(), monthlyDate.getDate());
monthlyDate.setDate(1);

monthlyDateReact.set(monthlyDate);

var nextMonthlyDate = new Date(monthlyDate);
nextMonthlyDate.setMonth(nextMonthlyDate.getMonth()+1);

var getMonthlyBarChart = function(divId){
    var pageContainer = document.getElementById(divId);
    pageContainer.innerHTML="";

    var barChartContainer = document.createElement("div");
    var barChartId = "monthlyBarChartContainer";

    barChartContainer.setAttribute("id", barChartId);
    pageContainer.appendChild(barChartContainer);

    // var ordersObj = Orders.find({createdAt : {$gt: monthlyDate, $lt: nextMonthlyDate}}).fetch();
    var ordersObj = Maestro.Atlas.Tally.GetOrders(monthlyDate, nextMonthlyDate);

    var dataObj = [];

    totalOrders = Maestro.Atlas.Tally.TotalOrderSales(monthlyDate, nextMonthlyDate);

    if(totalOrders == 0){
        Maestro.Atlas.BarChart(barChartId,[{label:"No Orders", total:0}]);
    } else {

        var maxDaysInMonth = new Date(monthlyDate.getFullYear(), monthlyDate.getMonth()+1, 0).getDate();

        for (i=0; i < maxDaysInMonth; i++){
            dataObj.push(
                    {label: i+1, total: 0.0}
                );
        }

        var orderDay, orderDate, orderTotal;

        for (i = 0; i < ordersObj.length; i++){
            orderDate = new Date(ordersObj[i].createdAt);
            orderDay = orderDate.getDate();
            orderTotal = ordersObj[i].subtotals.total;
            dataObj[orderDay].total += Math.round(orderTotal);
        }

        Maestro.Atlas.BarChart(barChartId,dataObj);
    }
};

Template.MonthlyView.onRendered(function(){
    getMonthlyBarChart('monthlyBarChart');

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});

Template.MonthlyView.helpers({
    getMonthlyOrdersTally : function(){
        monthlyDate = new Date(monthlyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderCount(monthlyDate, nextMonthlyDate);
    },

    getMonthlySalesTally : function(){
        monthlyDate = new Date(monthlyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderSales(monthlyDate, nextMonthlyDate).toFixed(2);
    },

    getSelectedMonthlyDate : function(){ 
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        monthlyDate = new Date(monthlyDateReact.get());

        var nextMonthlyDateTemp = new Date(nextMonthlyDate);
        nextMonthlyDateTemp.setDate(nextMonthlyDateTemp.getDate()-1);

        var labelString = months[monthlyDate.getMonth()] ;

        return labelString;
    },

    getMonthlyProductsTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.ProductsTable(monthlyDateReact.get(), nextMonthlyDate);

    },

    getDailyCategoryTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.CategoryTable(monthlyDateReact.get(), nextMonthlyDate);
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    refreshMonthlyGraph: function(){
        if(monthlyDateReact.get() || Maestro.Business.getLocationId()){
            if(document.getElementById('monthlyBarChart')){
                getMonthlyBarChart('monthlyBarChart');
            }
        }
    },
});

Template.MonthlyView.events({
    'click #nextMonth': function(event, target){
        monthlyDate = new Date(monthlyDateReact.get());

        monthlyDate.setMonth(monthlyDate.getMonth()+1);
        nextMonthlyDate.setMonth(nextMonthlyDate.getMonth()+1);
        monthlyDateReact.set(monthlyDate);

    //     getMonthlyBarChart('monthlyBarChart');
    },

    'click #previousMonth': function(event, target){
        monthlyDate = new Date(monthlyDateReact.get());

        monthlyDate.setMonth(monthlyDate.getMonth()-1);
        nextMonthlyDate.setMonth(nextMonthlyDate.getMonth()-1);

        monthlyDateReact.set(monthlyDate);

        // getMonthlyBarChart('monthlyBarChart');
        
    },

    'click .forceRefreshMonthly': function(event, target){
        getMonthlyBarChart('monthlyBarChart');
    }
    

});