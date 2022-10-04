function getDateRange(fromDate, toDate = null, fromDateTimeBucket, toDateTimeBucket) {
    check(fromDate, Match.OneOf(Date, String));
    check(toDate, Match.Optional(Match.OneOf(Date, String, null)));

    let dateRange = {};
    let filter = {};
    let group = {
        year: "$year",
        // dayOfYear: "$dayOfYear"
    };
    let isSingleDate = false;

    let startDate = moment(fromDate);
    let endDate = null;

    if(!toDate){
        endDate = startDate;
        isSingleDate = true;
    } else {
        endDate = moment(toDate);

        if(!endDate.isValid()) {
            throw new Meteor.Error("invalid_date", "If provided, end date must be a valid date!");
        }
    }
     
    if(!startDate.isValid()) {
        throw new Meteor.Error("invalid_date", "Start date must be a valid date!");
    }

    if(Math.abs(startDate.diff(endDate, 'days', true)) <= 1) {
        isSingleDate = true;
    }

    // console.log('fromDateTimeBucket: ', fromDateTimeBucket);
    // console.log('toDateTimeBucket: ', toDateTimeBucket);

    // fromDateTimeBucket = {
    //     year: 2016,
    //     month: 11,
    //     date:31,
    //     hour: 0
    // };

    // toDateTimeBucket = {
    //     year: 2017,
    //     month: 1,
    //     date:3,
    //     hour: 23
    // };

    //a date range has been provided
    // let firstDate = moment.min(startDate, endDate).utc().startOf('day').toDate();
    // let lastDate = moment.max(startDate, endDate).utc().endOf('day').toDate();

    // let firstDate = startDate.startOf('day').toDate();
    // let lastDate = endDate.endOf('day').toDate();

    // firstDate = moment.utc(firstDate).toDate();
    // lastDate = moment.utc(lastDate).toDate();


    // console.log('fromDateTimeBucket: ', fromDateTimeBucket);
    // console.log('toDateTimeBucket: ', toDateTimeBucket);

    // console.log('start date ', moment(firstDate).year(), moment(firstDate).month(), moment(firstDate).date());
    // console.log('end date ', moment(endDate).year(), moment(endDate).month(), moment(endDate).date());

    // if(isSingleDate){
    //     filter = { 
    //             'timeBucket.year': {$gte: fromDateTimeBucket.year, $lte: toDateTimeBucket.year},
    //             'timeBucket.month' : {$gte: fromDateTimeBucket.month, $lte: toDateTimeBucket.month},
    //             'timeBucket.day' : {$gte: fromDateTimeBucket.date, $lte: toDateTimeBucket.date},
    //             'timeBucket.hour' : {$gte: fromDateTimeBucket.hour, $lte: toDateTimeBucket.hour}
    //         };
    // } else {
        filter.createdAt = {$gte: startDate.toDate(), $lte: endDate.toDate()};
    // }

    // console.log("from: ", startDate.toDate(), "to: ", endDate.toDate());

    // if (fromDateTimeBucket.date > toDateTimeBucket.date){
    //     filter = {$or: [
    //         {
    //             'timeBucket.year': {$gte: fromDateTimeBucket.year, $lte: toDateTimeBucket.year},
    //             'timeBucket.month' :{$eq: fromDateTimeBucket.month},
    //             'timeBucket.day' :{$gte: fromDateTimeBucket.date, $lte: 31}
    //         },
    //         {
    //             'timeBucket.year': {$gte: fromDateTimeBucket.year, $lte: toDateTimeBucket.year},
    //             'timeBucket.month' :{$gte: fromDateTimeBucket.month + 1, $lte: toDateTimeBucket.month},
    //             'timeBucket.day' :{$gte: 1, $lte: toDateTimeBucket.date}
    //         },
    //     ]};
    // } else {
    //     filter = 
    //         {
    //             'timeBucket.year': {$gte: fromDateTimeBucket.year, $lte: toDateTimeBucket.year},
    //             'timeBucket.month' : {$gte: fromDateTimeBucket.month, $lte: toDateTimeBucket.month},
    //             'timeBucket.day' : {$gte: fromDateTimeBucket.date, $lte: toDateTimeBucket.date},
    //         };
    // }

    // console.log(filter);

    if(isSingleDate === true)  {
        group.hour = "$hour";
    }

    dateRange.filter = filter;
    dateRange.group = group;
    dateRange.includeHoursDetails = isSingleDate;

    return dateRange;
};

const flattenOrder = {
    $unwind: "$items"
};

const sortResults = {
    $sort: {
        "total": 1
    }
};

const projectFields = {
    $project: {
        "businessId": 1,
        "locationId": 1,
        "customerId": 1,
        "items.product": 1,
        "items.quantity": 1,
        "items.total": 1,
        "subtotals": 1,
        "payment": 1,
        year: "$timeBucket.year",
        month: "$timeBucket.month",
        day: "$timeBucket.day",
        hour: "$timeBucket.hour",
        // year: {$year: "$createdAt"},
        // month: {$month: "$createdAt"},
        // day: {$dayOfMonth: "$createdAt"},
        // hour: {$hour: "$createdAt"},
        // week: {$week: "$createdAt"},
        // dayOfYear: {$dayOfYear: "$createdAt"}
    }
};

function getOrderResults(orderFilter, includeHoursDetails) {
    let groupByFields = {
        "businessId": "$businessId",
        "locationId": "$locationId",
        year: "$year",
        month: "$month",
        // week: "$week",
        day: "$day"
    };

    if(includeHoursDetails) {
        _.extend(groupByFields,
            { hour: "$hour" }
        );
    }

    let groupDetails = {
        _id: groupByFields,
        count: {"$sum": 1},
        subtotal: {"$sum": "$subtotals.subtotal"},
        discount: {"$sum": "$subtotals.discount"},
        adjustments: {"$sum": "$subtotals.adjustments"},
        tax: {"$sum": "$subtotals.tax"},
        hst: {"$sum": "$subtotals.taxComponents.hst"},
        gst: {"$sum": "$subtotals.taxComponents.gst"},
        pst: {"$sum": "$subtotals.taxComponents.pst"},
        total: {"$sum": "$subtotals.total"},
        cashRoundedAmount: {"$sum": "$payment.rounding"},
        amountCollected: {"$sum": "$payment.received"},
        giftCardTotal: {"$sum": "$payment.giftCardTotal"}
    };

    let aggregationPipeline = prepareOrdersAggregationPipeline(orderFilter, groupDetails);

    // console.log("+++ PIPELINE :: ", aggregationPipeline);

    return Orders.aggregate(aggregationPipeline, {cursor: {}});
}

// function getCategoryResults(orderFilter, includeHoursDetails) {
//     let groupByFields = {
//         "businessId": "$businessId",
//         "locationId": "$locationId",
//         "categoryId": "$items.product.categoryId",
//         year: "$year",
//         month: "$month",
//         week: "$week",
//         day: "$day"
//     };

//     if(includeHoursDetails) {
//         _.extend(groupByFields,
//             { hour: "$hour" }
//         );
//     }

//     let groupDetails = {
//         _id: groupByFields,
//         count: {"$sum": "$items.quantity"},
//         redeemed: {"$sum": "$items.redeemed"},
//         amount: {"$sum": "$items.total"}
//     };

//     let aggregationPipeline = prepareFlattenedOrdersAggregationPipeline(orderFilter, groupDetails);

//     // console.log("+++ PIPELINE ++ CATEGORIES :: ", aggregationPipeline);

//     return Orders.aggregate(aggregationPipeline);
// }

function getProductResults(orderFilter, includeHoursDetails) {
    let groupByFields = {
        "businessId": "$businessId",
        "locationId": "$locationId",
        "productId": "$items.product._id",
    };

    let groupDetails = {
        _id: groupByFields,
        count: {"$sum": "$items.quantity"},
        amount: {"$sum": "$items.total"}
    };

    let aggregationPipeline = prepareFlattenedOrdersAggregationPipeline(orderFilter, groupDetails);

    // console.log("+++ PIPELINE ++ PRODUCTS :: ", aggregationPipeline);

    return Orders.aggregate(aggregationPipeline, {cursor: {}});
}

function getCustomerResults(orderFilter, includeHoursDetails) {
    let groupByFields = {
        "businessId": "$businessId",
        "customerId": "$customerId"
    };

    let groupDetails = {
        _id: groupByFields,
        count: {"$sum": 1},
        subtotal: {"$sum": "$subtotals.subtotal"},
        discount: {"$sum": "$subtotals.discount"},
        adjustments: {"$sum": "$subtotals.adjustments"},
        tax: {"$sum": "$subtotals.tax"},
        hst: {"$sum": "$subtotals.taxComponents.hst"},
        gst: {"$sum": "$subtotals.taxComponents.gst"},
        pst: {"$sum": "$subtotals.taxComponents.pst"},
        total: {"$sum": "$subtotals.total"},
        cashRoundedAmount: {"$sum": "$payment.rounding"},
        amountCollected: {"$sum": "$payment.received"},
        giftCardTotal: {"$sum": "$payment.giftCardTotal"} 
    };

    let aggregationPipeline = prepareOrdersAggregationPipeline(orderFilter, groupDetails);

    // console.log("+++ PIPELINE ++ PRODUCTS :: ", aggregationPipeline);

    return Orders.aggregate(aggregationPipeline, {cursor: {}});
}

function prepareOrdersAggregationPipeline(filter, group) {
    let pipeline = [];

    pipeline.push({ $match: filter });
    // pipeline.push(flattenOrder);
    pipeline.push(projectFields); //todo add $lookup for categories
    pipeline.push({ $group: group });
    pipeline.push(sortResults);
    // pipeline.push({cursor: {}});

    return pipeline;
}

function prepareFlattenedOrdersAggregationPipeline(filter, group) {
    let pipeline = [];

    pipeline.push({ $match: filter });
    pipeline.push(flattenOrder);
    pipeline.push(projectFields); //todo add $lookup for categories
    pipeline.push({ $group: group });
    pipeline.push(sortResults);
    // pipeline.push({cursor: {}});

    return pipeline;
}

Maestro.Atlas.Dashboard.getAggregatedResults = function(businessId, locationId, fromDate, toDate = null, fromDateTimeBucket, toDateTimeBucket) {
    let dateRange = getDateRange(fromDate, toDate, fromDateTimeBucket, toDateTimeBucket);

    console.log("DATE RANGE::: ", dateRange);

    let orderFilter = {
        status: 'Completed',
        businessId: businessId
    };

    if(locationId) {
        orderFilter.locationId = locationId;
    }

    let filter = _.extend(orderFilter, dateRange.filter);

    console.log("#### getting Orders ####/n");
    let orders = getOrderResults(filter, dateRange.includeHoursDetails);

    // let categories = getCategoryResults(filter, dateRange.includeHoursDetails);

    console.log("#### getting products ####/n");
    let products = getProductResults(filter, dateRange.includeHoursDetails);

    let customerFilter = filter;
    customerFilter.customerId = {$ne: null};

    console.log("#### getting customers ####/n");
    let customers = getCustomerResults(customerFilter, dateRange.includeHoursDetails);


    console.log("returning: ", {
        orders: orders,
        // categories: categories,
        products: products,
        customers: customers,
        processedAt: new Date()
    });

    return {
        orders: orders,
        // categories: categories,
        products: products,
        customers: customers,
        processedAt: new Date()
    };

};

//console.log("ORDER METHOD::: ", getAggregatedResults('XsLzw9HncN2JncZoB', null, '2016-05-26', '2016-05-26').orders[0]);

//todo following can be removed
/*

let aggregationPipeline = [
    {
        $match: {
            status: 'Completed'
        }
    },
    {
        $unwind: "$items"
    },
    {
        $project: {
            "businessId": 1,
            "locationId": 1,
            "items.product": 1,
            "subtotals": 1,
            year: {$year: "$createdAt"},
            month: {$month: "$createdAt"},
            day: {$dayOfMonth: "$createdAt"},
            hour: {$hour: "$createdAt"},
            week: {$week: "$createdAt"},
            dayOfYear: {$dayOfYear: "$createdAt"}
        }
    },
    {
        $group: {
            _id: {
                "businessId": "$businessId",
                "locationId": "$locationId",
                "productName": "$items.product.name",
                "productId": "$items.product.productId",
                "productCategoryId": "$items.product.categoryId",
                year: "$year",
                month: "$month",
                week: "$week",
                day: "$day",
                hour: "$hour"
            },
            ordersCount: {"$sum": 1},
            subtotal: {"$sum": "$subtotals.subtotal"},
            discount: {"$sum": "$subtotals.discount"},
            adjustments: {"$sum": "$subtotals.adjustments"},
            tax: {"$sum": "$subtotals.tax"},
            total: {"$sum": "$subtotals.total"}
        }
    },
    {
        $sort: {
            "total": 1
        }
    }
];

///TODO tyring out aggregate here
let startTime = new Date();

let results = Orders.aggregate([
    { $match: { status: 'Completed' } },
    { $unwind: "$items" },
    { $project:
    {
        "businessId": 1,
        "locationId": 1,
        "items.product": 1,
        "subtotals": 1,
        "createdAt": 1,
        year: {$year: "$createdAt"},
        month: {$month: "$createdAt"},
        week: {$week: "$createdAt"},
        day: {$dayOfYear: "$createdAt"},
        hour: {$hour: "$createdAt"}
    }
    },
    {
        $group: {
            _id: {
                "businessId" : "$businessId",
                "locationId": "$locationId",
                "productName": "$items.product.name",
                "productCategory": "$items.product.category",
                year: "$year",
                month: "$month",
                week: "$week",
                day: "$day",
                hour: "$hour"
            },
            ordersCount: { "$sum": 1 },
            subtotal: { "$sum": "$subtotals.subtotal"},
            discount: { "$sum": "$subtotals.discount"},
            adjustments: { "$sum": "$subtotals.adjustments"},
            tax: { "$sum": "$subtotals.tax"},
            total: { "$sum": "$subtotals.total"}
        }
    },
    { $sort: { "total": 1 } }
]);

let endTime = new Date();


console.log("Order grouped : ", results.length);

let printTime = new Date();


console.log("START TIME:: ", startTime);
console.log("END TIME:: ", endTime);
console.log("Print TIME:: ", printTime);

let anOrder = Orders.findOne({ createdAt: {$gt: moment('2016-06-01').toDate()} });

console.log("An Order:: ", anOrder);

console.log("An Order:: Product", anOrder.items[0].product);
*/




